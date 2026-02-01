<?php

$inData = getRequestInfo();

$id = $inData["id"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error)
{
    returnWithError($conn->connect_error);
}
else
{
    $check = $conn->prepare("SELECT ID FROM Contacts WHERE ID=?");
    $check->bind_param("i", $id);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows == 0)
    {
        returnWithError("Contact not found");
        $check->close();
        $conn->close();
        exit();
    }
    $check->close();

    $stmt = $conn->prepare("UPDATE Contacts
                            SET FirstName=?, LastName=?, Phone=?, Email=?, UpdatedAt=NOW()
                            WHERE ID=?");
    $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $id);

    if ($stmt->execute())
    {
        returnWithInfo("Contact updated successfully");
    }
    else
    {
        returnWithError("Unable to update contact");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($msg)
{
    $retValue = '{"error":"", "message":"' . $msg . '"}';
    sendResultInfoAsJson($retValue);
}

?>
