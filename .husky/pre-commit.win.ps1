param()
$ErrorActionPreference = 'Stop'
$npm = if ($IsWindows) { 'npm.cmd' } else { 'npm' }
$process = Start-Process -FilePath $npm -ArgumentList @('run', 'validate') -NoNewWindow -Wait -PassThru
if ($process.ExitCode -ne 0) {
    exit $process.ExitCode
}
