/*==================================================================
 * Arquivo: arduinoComunicationSport
 * Descrição: Comunicaço SerialPort do arduino com o Node.js
 * Author: Fausto Pegado
 * Data de Criação: 28/03/2017
==================================================================*/

#include <dht.h>
#define dht_dpin A1
dht DHT; //Inicializa o sensor

String pin = "", state = "", temperatureMax = "", temperatureMin = "";
 
float temperatureAviario1 = 0;

char message[20];

int i = 0;

void setup() {
  Serial.begin(9600);
  
  for(i = 2; i <= 13; i++){
    pinMode(i, OUTPUT);
  }
  
}

void loop() {
  
  pin = "";
  state = "";
  temperatureMax = "";
  temperatureMin = "";
  
  readStringSerialPort(); 
  temperatureAviario1 = checTemperature();
  
  Serial.println (pin);
  Serial.println (state);
  Serial.println (temperatureMax);
  Serial.println (temperatureMin);
  
  //a funçao atoi tem como finalidade transformar strinc em numerico
  int exitDor = atoi( pin.c_str() );
  
  /*recebe um valor numerico que refere-se ao pino de saida 
  */
  switch (exitDor) {
    case 2:
      switchState(2, state);
      break;
    case 3:
      switchState(3, state);
      break;
    case 4:
      switchState(4, state);
      break;
    case 5:
      switchState(5, state);
      break;
    case 6:
      switchState(6, state);
      break;
    case 7:
      switchState(7, state);
      break;
    case 8:
      switchState(8, state);
      break;
    case 9:
      switchState(9, state);
      break;
    case 10:
      switchState(10, state);
      break;
    case 11:
      switchState(11, state);
      break;
    case 12:
      switchState(12, state);
      break;
    case 13:
      switchState(13, state);
      break;
    default:
      break;
  }
  
  delay (200);
}

void readStringSerialPort () {
  
  int i = 0;
  
  while (Serial.available() > 0) {
    char c = Serial.read();
    message[i] = c;
    i++;
  }
  
  sortMessage();
}
/*Pega a mensagem que a funcao readStringSerialPort() recuperou e separa
para cada variavel.
*/
void sortMessage () {
  int cont = 0;
  
  for (int i = 0; i<sizeof(message); i++) {
    
   if (message[i] != ';' && cont < 2) {
      
     pin = pin + message[i];
   } else if (message[i] != ';' && cont==3) {
      
     state = state + message[i];
   } else if (message[i] != ';' && cont==6) {
      
     temperatureMax = temperatureMax + message[i];
   } else if (message[i] != ';' && cont==9) {
      
     temperatureMin = temperatureMin + message[i];
   }
    cont++;
  }
}

/*Funçao para leitura da porta serial.
*/
void switchState(int pino, String state) {
  if(state == "0"){
    digitalWrite (pino, HIGH);
  }
  if(state == "1"){
    digitalWrite (pino, LOW);
  }
}

/*Funcao para checar a temperatura
*/
float checTemperature() {
  DHT.read11(dht_dpin); //Lê as informações do sensor
  //Serial.print("Temperatura = ");
  Serial.println(DHT.temperature); 
  //Serial.println(" Celsius  ");
  
//  if(temperaturaBalde > 40.00){
//    pino = "11";
//    estado = "0";
//  }else if (temperaturaBalde <= 35.00){
//    pino = "11";
//    estado = "1";
//  }
  
  return (float) DHT.temperature;
}

/*Funcao checar a para humidade
*/
float checHumidity() {
  DHT.read11(dht_dpin); //Lê as informações do sensor
  //Serial.print("Umidade = ");
  //Serial.print(DHT.humidity);
  //Serial.print(" %  ");
  return DHT.humidity;
}
