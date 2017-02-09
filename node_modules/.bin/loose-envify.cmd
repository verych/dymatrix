@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\loose-envify\cli.js" %*
) ELSE (
  node  "%~dp0\..\loose-envify\cli.js" %*
)