class AppConfig {
  // Cambia esto a la IP de tu computadora en la red Wi-Fi si vas a probar en un celular físico
  // Ejemplo: 'http://192.168.1.10:3000'
  // Para emulador de Android usa: 'http://10.0.2.2:3000'
  // Para Web o emulador de iOS usa: 'http://localhost:3000'
  static const String baseUrl = 'http://localhost:3000';
  
  static const String apiUrl = '$baseUrl/api';
}
