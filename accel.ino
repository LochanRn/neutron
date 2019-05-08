//#include <SpacebrewYun.h>

#include <Ethernet.h>
#include <EthernetUdp.h>
#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

String str;
char data[100];
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ipp(192, 168, 1, 77), ip(192, 168, 1, 177);
unsigned int localPort = 23907;      // local port to listen on


EthernetUDP Udp;


float acc=0, pitch=0, roll=0, yaw;
void setup() 
{
  Serial.begin(115200);
  Ethernet.begin(mac, ip);
  Udp.begin(localPort);
  pinMode(13,OUTPUT);
  digitalWrite(13,0);
  Serial.println("Initialize MPU6050");

  while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G))
  {
    Serial.println("Could not find a valid MPU6050 sensor, check wiring!");
    delay(500);
  }

  checkSettings();
}

void checkSettings()
{
  Serial.println();
  
  Serial.print(" * Sleep Mode:            ");
  Serial.println(mpu.getSleepEnabled() ? "Enabled" : "Disabled");
  
  Serial.print(" * Clock Source:          ");
  switch(mpu.getClockSource())
  {
    case MPU6050_CLOCK_KEEP_RESET:     Serial.println("Stops the clock and keeps the timing generator in reset"); break;
    case MPU6050_CLOCK_EXTERNAL_19MHZ: Serial.println("PLL with external 19.2MHz reference"); break;
    case MPU6050_CLOCK_EXTERNAL_32KHZ: Serial.println("PLL with external 32.768kHz reference"); break;
    case MPU6050_CLOCK_PLL_ZGYRO:      Serial.println("PLL with Z axis gyroscope reference"); break;
    case MPU6050_CLOCK_PLL_YGYRO:      Serial.println("PLL with Y axis gyroscope reference"); break;
    case MPU6050_CLOCK_PLL_XGYRO:      Serial.println("PLL with X axis gyroscope reference"); break;
    case MPU6050_CLOCK_INTERNAL_8MHZ:  Serial.println("Internal 8MHz oscillator"); break;
  }
  
  Serial.print(" * Accelerometer:         ");
  switch(mpu.getRange())
  {
    case MPU6050_RANGE_16G:            Serial.println("+/- 16 g"); break;
    case MPU6050_RANGE_8G:             Serial.println("+/- 8 g"); break;
    case MPU6050_RANGE_4G:             Serial.println("+/- 4 g"); break;
    case MPU6050_RANGE_2G:             Serial.println("+/- 2 g"); break;
  }  

  Serial.print(" * Accelerometer offsets: ");
  mpu.getAccelOffsetX();
  mpu.getAccelOffsetY();
  mpu.getAccelOffsetZ();
  
  Serial.println();
}

void loop()
{
  Vector rawAccel = mpu.readRawAccel();
  Vector normAccel = mpu.readNormalizeAccel();
  Serial.print(normAccel.XAxis);
  Serial.print("       ");
  Serial.print(normAccel.YAxis);
  Serial.println("       ");
  pitch = normAccel.XAxis;
  roll = normAccel.YAxis;
  yaw = 0;
  str=String("#")+String(",")+String(pitch)+String(",")+String(yaw)+String(",")+String(roll)+String(",");
 int a=str.length();
for(int i=0;i<a;i++)
  data[i]=str.charAt(i);

Udp.beginPacket(ipp, localPort );
Udp.write(data);
Udp.endPacket();
Serial.println("sent");
  delay(100);
}
