<?php

$from = 'wadseth.tobias@gmail.com';

$sendTo = 'wadseth.tobias@gmail.com';

$subject = 'Nytt meddelande från kontaktformulär!';

$fields = array('InputName' => 'Namn', 'InputEmail' => 'Email', 'InputMessage' => 'Meddelande');

$successMessage = 'Ditt meddelande har skickats!';

$errorMessage = 'Ett fel uppstod när meddelandet skulle skickas. Var vänlig försök igen senare!';

try {
    if (count($_POST) == 0) {
        throw new \Exception('Form is empty');
    }

    $emailText = "Du har fått ett nytt meddelande från ditt kontaktformulär!\n\n";

    foreach ($_POST as $key => $value) {
        if (isset($fields[$key])) {
            $emailText .= "$fields[$key]:\n$value\n\n";
        }
    }

    $headers = array('Content-Type: text/plain; charset="UTF-8";',
        'From: ' . $from,
        'Reply-To: ' . $from,
        'Return-Path: ' . $from,
    );

    mail($sendTo, $subject, $emailText, implode("\n", $headers));

    $responseArray = array('type' => 'success', 'message' => $successMessage);
} catch (\Exception $e) {
    $responseArray = array('type' => 'danger', 'message' => $errorMessage);
}


if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $encoded = json_encode($responseArray);

    header('Content-Type: application/json');

    echo $encoded;
}

else {
    echo $responseArray['message'];
}
