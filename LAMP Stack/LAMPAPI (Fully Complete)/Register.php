<?php
    $inData = getRequestInfo();

    #fields
    $FirstName = $inData["firstName"];
    $LastName = $inData["lastName"];
    $Login = $inData["login"];
    $Password = $inData["password"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $check = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
        $check->bind_param("s", $Login);
        $check->execute();
        $result = $check->get_result();

        if ($result->num_rows > 0)
        {
            returnWithError("Login already exists");
            $check->close();
            $conn->close();
            exit();
        }
        $check->close();

        $stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $FirstName, $LastName, $Login, $Password);
        $stmt->execute();
        $stmt->close();
        $conn->close();

        returnWithError("");
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
?>
