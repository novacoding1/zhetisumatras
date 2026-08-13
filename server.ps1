$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:3000/')
$listener.Start()
Write-Host "Server running at http://localhost:3000/"

$root = "C:\Users\Zangar\.gemini\antigravity\scratch\mattress-store"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $relPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relPath)) { $relPath = "index.html" }
        $path = [System.IO.Path]::Combine($root, $relPath)

        if (Test-Path $path -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($path)
            $ext = [System.IO.Path]::GetExtension($path).ToLower()
            switch ($ext) {
                ".html" { $res.ContentType = "text/html; charset=utf-8" }
                ".css"  { $res.ContentType = "text/css" }
                ".js"   { $res.ContentType = "application/javascript" }
                ".json" { $res.ContentType = "application/json" }
                ".png"  { $res.ContentType = "image/png" }
                ".jpg"  { $res.ContentType = "image/jpeg" }
                default { $res.ContentType = "application/octet-stream" }
            }
            $res.ContentLength64 = $content.Length
            $res.OutputStream.Write($content, 0, $content.Length)
        } else {
            $res.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $res.OutputStream.Close()
    } catch {
        # Continue on request drop
    }
}
