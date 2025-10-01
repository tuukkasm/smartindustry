
//MQTT-välityspalvelimen määrittely
const mqtt    = require('mqtt');
const broker = 'mqtt://test.mosquitto.org';
const user = '';
const pw = ''; 

//määritellään välityspalvelimen "olio"
mq = mqtt.connect(broker, {
  'username': user,
  'password': pw
});

//tilataan oikea topic
mq.subscribe('test/#');

//liitytään välityspalvelimeen
mq.on('connect', function(){
    console.log('Connected.....');
});

//Määritellään tietokanta-API
const { MongoClient, ServerApiVersion } = require('mongodb');

//korvaa alla oleva URI-string omalla URI:lla (hae se Mongo Atlaksen Connect-kohdasta, lisää myös oma käyttäjätunnus ja salasana)
const uri = "mongodb+srv://tuukka:tuukka@cluster0.hzibcq4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//määritellään tietokannan ja kokoelman nimi sekä dataobjekti sensoridatan käsittelyyn
const myDB = client.db("test");
const myColl = myDB.collection("automaatio");
var obj;

//odotetaan dataa välityspalvelimelta ja viedään data tietokantaan
mq.on('message', function(topic, message) {
  console.log(message.toString('utf8'));
  obj = JSON.parse(message);
	myColl.insertOne(obj);
	console.log(
	`An entry was inserted successfully`,
	);
});

