<?

//We use already made Twitter OAuth library
//https://github.com/mynetx/codebird-php
require_once ('codebird.php');

//Twitter OAuth Settings, enter your settings here:
$CONSUMER_KEY = 'b3v7ERd1r8thi5e3awr68Q';
$CONSUMER_SECRET = '4iu0hR7iLBWlBo6V1i6y118Io6H6vIaOsm9Qm6vK8';
$ACCESS_TOKEN = '46776630-VcLgYhiEyweaKle2MdvnGlrtElP7ogGw53wfmauzK';
$ACCESS_TOKEN_SECRET = 'iroTLI9sSZY0LkanECAhgFlsDfJHOCda0Cj847Hjw';

//Get authenticated
Codebird::setConsumerKey($CONSUMER_KEY, $CONSUMER_SECRET);
$cb = Codebird::getInstance();
$cb->setToken($ACCESS_TOKEN, $ACCESS_TOKEN_SECRET);


//retrieve posts
$q = $_POST['q'];
$count = $_POST['count'];
$api = $_POST['api'];

//https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
//https://dev.twitter.com/docs/api/1.1/get/search/tweets
$params = array(
	'screen_name' => $q,
	'q' => $q,
	'count' => $count
);

//Make the REST call
$data = (array) $cb->$api($params);

//Output result in JSON, getting it ready for jQuery to process
echo json_encode($data);

?>