import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'config.dart';

class AuthService {
  final _storage = const FlutterSecureStorage();

  // Iniciar sesión y guardar JWT
  Future<bool> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConfig.apiUrl}/auth/login'), // Ajusta la ruta a tu backend
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'username': username, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['token']; // Asumiendo que el backend retorna { "token": "..." }
        
        // Guardar token localmente
        await _storage.write(key: 'jwt_token', value: token);
        return true;
      }
    } catch (e) {
      print('Error en login: $e');
    }
    return false;
  }

  // Recuperar token
  Future<String?> getToken() async {
    return await _storage.read(key: 'jwt_token');
  }

  // Cerrar sesión
  Future<void> logout() async {
    await _storage.delete(key: 'jwt_token');
  }
}
