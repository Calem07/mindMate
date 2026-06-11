$rand = [guid]::NewGuid().Guid.Substring(0,8)
$registerBody = @{
  name = "Test Student"
  email = "teststudent_$rand@example.com"
  password = "Password123"
} | ConvertTo-Json

try {
  $regRes = Invoke-RestMethod -Uri "http://localhost:8088/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
  $token = $regRes.token
  Write-Output "Registration successful! Token: $token"
  
  # Fetch companion
  $compRes = Invoke-RestMethod -Uri "http://localhost:8088/api/companion" -Method Get -Headers @{ Authorization = "Bearer $token" }
  Write-Output "Get companion response (initial): $compRes"
  
  # Adopt companion
  $adoptBody = @{
    petType = "Luna"
    petName = "TestPet"
    petLevel = 1
    petMood = "😊 Happy"
    petTheme = "Classic"
    petAccessory = "None"
  } | ConvertTo-Json
  
  try {
    $adoptRes = Invoke-RestMethod -Uri "http://localhost:8088/api/companion" -Method Post -Headers @{ Authorization = "Bearer $token" } -Body $adoptBody -ContentType "application/json"
    Write-Output "Adoption successful! Response:"
    Write-Output ($adoptRes | ConvertTo-Json)
  } catch {
    Write-Output "Adoption POST failed!"
    $statusCode = $_.Exception.Response.StatusCode
    $streamReader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $errorResponseBody = $streamReader.ReadToEnd()
    Write-Output "Status Code: $statusCode"
    Write-Output "Response Body: $errorResponseBody"
  }
} catch {
  Write-Error $_
}
