# -*- coding: utf-8 -*-
from application import app
from pusher import Pusher
from flask import request, jsonify
from user_info import *

p = Pusher(
	app_id=PUSHER_APP_ID,
	key=PUSHER_KEY,
	secret=PUSHER_SECRET,
)

@app.route('/api/echo', methods=['GET', 'POST'])
def test_message():
	data = request.form
	p['morningpusher'].trigger('echo', {'message' : data['message']})
	return jsonify(status=0)

def emit(action, data, broadcast=False):
	if broadcast:
		p['br'].trigger(action, data)
	else:
		p['private'].trigger(action, data)


@app.route('/api/call/<action_name>', methods=["POST"])
def api_call(action_name):
	data = request.form

	emit_new_message(data)

	return jsonify(status=0)


def emit_new_message(data):
	emit('new_message', {
		'message': data['message'],
		'username': data['username']
	}, broadcast=True)

