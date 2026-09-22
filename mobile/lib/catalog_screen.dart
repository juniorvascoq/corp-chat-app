import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'auth_service.dart';
import 'chat_screen.dart';
import 'config.dart';

class CatalogScreen extends StatefulWidget {
  @override
  _CatalogScreenState createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  final AuthService _authService = AuthService();
  List<dynamic> _products = [];
  bool _isLoading = true;
  int _productCount = 0;
  String _username = "Usuario";

  @override
  void initState() {
    super.initState();
    _fetchProducts();
    _fetchUserStats();
  }

  Future<void> _fetchUserStats() async {
    final token = await _authService.getToken();
    if (token == null) return;

    try {
      final response = await http.get(
        Uri.parse('${AppConfig.apiUrl}/users/me/stats'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _productCount = data['productCount'] ?? 0;
          _username = data['username'] ?? "Usuario";
        });
      }
    } catch (e) {
      print('Error obteniendo stats: $e');
    }
  }

  Future<void> _fetchProducts() async {
    final token = await _authService.getToken();
    
    if (token == null) {
      return;
    }

    try {
      final response = await http.get(
        Uri.parse('${AppConfig.apiUrl}/products'), // Ruta a tu backend
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        setState(() {
          _products = jsonDecode(response.body);
          _isLoading = false;
        });
      } else {
        throw Exception('Fallo al cargar productos');
      }
    } catch (e) {
      print('Error obteniendo productos: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Catálogo - $_username ($_productCount)'),
        actions: [
          IconButton(
            icon: const Icon(Icons.chat),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => ChatScreen()),
              );
            },
          )
        ],
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : ListView.builder(
            itemCount: _products.length,
            itemBuilder: (context, index) {
              final product = _products[index];
              return ListTile(
                title: Text(product['name'] ?? 'Producto sin nombre'),
                subtitle: Text('\$${product['price'] ?? '0.00'} • Por: ${product['created_by_user'] ?? 'Desconocido'}'),
              );
            },
          ),
    );
  }
}
