$(function() {
	var pusher = new Pusher(PUSHER_KEY),
		testChannel =pusher.subscribe('morningpusher'),
		broadcast = pusher.subscribe('br'), // 1-1 add
		$window = $(window),                // 1-1 add
		$messages = $('.messages'),
		$inputMessage = $('.inputMessage'),
		$usernameInput = $('.usernameInput[name=username]'),    
		$loginPage = $('.login.page'),
		$chatPage = $('.chat.page');

	var username;           
	
	$usernameInput.focus();
	
	/*
	$.ajax({
	  type: "POST",
	  url: url,
	  data: data,
	  success: success,
	  dataType: dataType
	});
	*/


	broadcast.bind('new_message', function(data) {
		addChatMessage(data);
	});

	
	function addChatMessage(data) {
		var $usernameDiv = $('<span class="username"></span>');
		$usernameDiv.css("color", getUsernameColor(data.username));
		$usernameDiv.text(data.username);

		var $messageBodyDiv = $('<span class="messageBody"></span>');
		$messageBodyDiv.text(data.message);

		var typingClass = data.typing ? 'typing' : '';
		var $messageDiv = $('<li class="message ' + typingClass + '"></li>');
		$messageDiv.append($usernameDiv)
			.append($messageBodyDiv)
			.data('username', data.username);

		addMessageElement($messageDiv);
	}

	function addMessageElement(el) {
		var $el = $(el);
		$messages.append($el);

		$messages[0].scrollTop = $messages[0].scrollHeight;
	}

	function getUsernameColor(username) {
		// Compute hash code
		var hash = 7;
		for (var i = 0; i < username.length; i++) {
			hash = username.charCodeAt(i) + (hash << 5) - hash;
		}
		// Calculate color
		var index = Math.abs(hash % 360);
		return "hsl(" + index + ", 77%, 60%)";
	}

	function sendMessage () {
        var message = $inputMessage.val().trim();

        // if there is a non-empty message
        if (message) {
            $inputMessage.val('');
            $.post('/api/call/new_message', {
                "message": message,
                "username": username
            });
        }
    }

    function setUsername() {
        var __username = $usernameInput.val().trim();

        // If the username is valid
        if (__username) {
            username = __username;
            $loginPage.fadeOut();
            $chatPage.show();
            $inputMessage.focus();
        }
    }

	$window.keydown(function(event) {
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
        	if (username) {
                sendMessage();
            } else {
                setUsername();
                $usernameInput.blur();
            }
        }
    });
});