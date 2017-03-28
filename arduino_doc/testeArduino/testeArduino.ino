/*==================================================================
 * Arquivo: arduinoComunicationSport
 * Descrição: Comunicaço SerialPort do arduino com o Node.js
 * Author: Fausto Pegado
 * Data de Criação: 28/03/2017
==================================================================*/

String conteudo = "";
char resposta[20];
int i = 0;

void setup() {
  Serial.begin(9600);
  
  for(i = 0; i < 12; i++){
    pinMode(i, OUTPUT);
  }
  
}

void loop() {
  lerStringSerial();
 
  String pino = "";
  String estado = "";
  int cont = 0;
  
  Serial.println("converssando com Node pela Porta Serial");
  
  for (int i = 0; i<sizeof(resposta); i++) {
    
    if (resposta[i] != ';' && cont < 2) {
      
      pino = pino + resposta[i];
   } else if (resposta[i] != ';' && cont==3) {
      
      estado = estado + resposta[i];
    }
    cont ++;
  }
  Serial.println(pino + "<---arduino");
  Serial.println(estado + "<--arduino");
  
  int opcao = atoi( pino.c_str() );
  
  switch(opcao){
    case 3:
      switchState(3, estado);
      break;
    case 4:
      switchState(4, estado);
      break;
    case 5:
      switchState(5, estado);
      break;
    case 6:
      switchState(6, estado);
      break;
    case 7:
      switchState(7, estado);
      break;
    case 8:
      switchState(8, estado);
      break;
    case 9:
      switchState(9, estado);
      break;
    case 10:
      switchState(10, estado);
      break;
    case 11:
      switchState(11, estado);
      break;
    case 12:
      switchState(12, estado);
      break;
    case 13:
      switchState(13, estado);
      break;
    default:
      break;
  }
  
  delay(200);
}

void lerStringSerial() {
  int i = 0;
  while(Serial.available() > 0){
    char c = Serial.read();
    resposta[i] = c;
    i++;
  }
}

void switchState(int pino, String estado){
  if(estado == "1"){digitalWrite (pino, HIGH);}
  if(estado == "0"){digitalWrite (pino, LOW);}
}
