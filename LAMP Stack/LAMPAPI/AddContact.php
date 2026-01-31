<?php
	$inData = getRequestInfo();
    #fields
    $FirstName = $inData["firstName"];
    $LastName = $inData["lastName"];
    $Phone = $inData["phone"];
    $Email = $inData["email"];
    $UserID = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserId,FirstName,LastName,Phone,Email) VALUES(?,?,?,?,?)");
		$stmt->bind_param("ssssss", $UserID, $FirstName, $LastName, $Phone, $Email);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>