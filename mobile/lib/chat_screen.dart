import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'auth_service.dart';
import 'config.dart';

class ChatScreen extends StatefulWidget {
  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final AuthService _authService = AuthService();
  final TextEditingController _msgCtrl = TextEditingController();
  
  late IO.Socket socket;
  List<String> _messages = [];

  @override
  void initState() {
    super.initState();
    _connectSocket();
  }

  void _connectSocket() async {
    final token = await _authService.getToken();

    // Configuración de conexión enviando el JWT en la autenticación
    socket = IO.io(AppConfig.baseUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
      'auth': {'token': token} // Enviando token
    });

    socket.connect();
    socket.onConnect((_) {
      print('Conectado al servidor de chat');
    });

    socket.on('receive_message', (data) {
      setState(() {
        _messages.add(data['message']);
      });
    });

    socket.onDisconnect((_) => print('Desconectado'));
  }

  void _sendMessage() {
    if (_msgCtrl.text.isNotEmpty) {
      // Enviar mensaje al servidor
      socket.emit('send_message', {'message': _msgCtrl.text});
      setState(() {
        _messages.add('Yo: ${_msgCtrl.text}');
        _msgCtrl.clear();
      });
    }
  }

  @override
  void dispose() {
    socket.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chat en Vivo')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(_messages[index]),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _msgCtrl,
                    decoration: const InputDecoration(
                      hintText: 'Escribe un mensaje...',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send, color: Colors.blue),
                  onPressed: _sendMessage,
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
