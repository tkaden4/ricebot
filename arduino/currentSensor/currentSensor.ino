/* Read values from the ACS712x30A current sensor and
 * transmit cleaned averages over serial.
 * This algorithm works best with purely resistive
 * loads. */

#define SENSOR_PIN A0 //The sensor analog input pin

/* Exponential filter described here: 
 * https://gregstanleyandassociates.com/whitepapers/FaultDiagnosis/Filtering/Exponential-Filter/exponential-filter.htm */
double exponentialFilter(double prev, double curr, double a)
{
  return prev * a + (1 - a) * curr;
}

/* Read a value between 0 and 1 */
double readValue()
{
  return (abs((analogRead(SENSOR_PIN) - 512) / 1024.0));
}

/* Read the maximum value over a period of time */
double readMax(int cycles)
{
  double m = 0;
  for (int i = 0; i < cycles; ++i)
  {
    m = max(readValue(), m);
  }
  return m;
}

/* Get the average of the maximum values in a period of time */
double readSegment(int cycles, int mcycles)
{
  double sum = 0;
  for (int i = 0; i < cycles; ++i)
  {
    sum += readMax(mcycles);
  }
  return sum / cycles;
}

static double prev = 0;

void setup()
{
  Serial.begin(9600);
  pinMode(SENSOR_PIN, INPUT);
}

void loop()
{
  prev = exponentialFilter(prev, (readSegment(5, 40)), 0.7);
  Serial.println(1000 * prev / 70.0);
}
