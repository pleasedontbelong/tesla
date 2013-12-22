$(function() {

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    /** LOGIN **/
    var user = false;
    $('#login form').on('submit', function( event ) {
        event.preventDefault();
        var data = $( this ).serializeArray();
        data = data[0];
        if(data.value.trim().length > 0){
            $("#login").css('display', 'none');
            $("#container").css('display', 'block');
            new Chat(data.value);
        }
    });

    /* Chat Class */
    var Chat = (function () {
        function Chat(user) {
            this.user = user;
            this.last_seen_id = "";
            this.chart_content = $('#chat-content')[0];
            
            this.getMessages();
            this.interval = setInterval(this.getMessages.bind(this), 5000);
            
            $('form.message').on('submit', function( event ) {
                event.preventDefault();
                this.sendMessage();
            }.bind(this));
            $('textarea').on('keypress',function(e){
                if ( e.which == 13 ) {
                    this.sendMessage();
                    return false;
                }
                return true;
            }.bind(this));
        }
        Chat.prototype.getMessages = function () {
            $.ajax({
                url: "/api/messages/list/" + this.user + "/" + this.last_seen_id,
                cache: false,
                beforeSend: function(){this.showLog("Buscando nuevos mensajes...");}.bind(this),
                complete: this._clearLog
            }).done(this.processMessages.bind(this)).fail(this.showError.bind(this));
        };
        Chat.prototype.sendMessage = function () {
            var data = $('form.message').serializeArray();
            data = data[0];
            var message = {
                user: this.user,
                content: data.value
            };
            
            if(data.value.trim().length > 0){
                $.ajax({
                    type: "POST",
                    url: "/api/messages/create",
                    data: message,
                    beforeSend: function(){this.showLog("Enviando mensaje...");}.bind(this),
                    complete: this._clearLog
                }).done(function(response){
                    this.addMessage(response);
                    $('form.message textarea').val('');
                    $(this.chart_content).scrollTop(this.chart_content.scrollHeight);
                }.bind(this)).fail(this.showError.bind(this));
            }
        };

        Chat.prototype.processMessages = function (messages) {
            messages.reverse();
            $(messages).each(function(index, message){
                this.addMessage(message, true);
            }.bind(this));
            $(this.chart_content).scrollTop(this.chart_content.scrollHeight);
        };

        Chat.prototype.addMessage = function (data, is_external) {
            if(typeof is_external == "undefined"){
                is_external = false;
            }
            var date = new Date(data.created);
            var datestring = ("0" + date.getHours()).slice(-2) + ":" +
                             ("0" + date.getMinutes()).slice(-2) + ":" +
                             ("0" + date.getSeconds()).slice(-2);
            $(this.chart_content).append(
                "<div class='message " + (is_external ? "other" : "me" ) + "'>" +
                "<span class='date'>" + datestring + "</span> " +
                "<span class='from'>" + data.user + " :</span>" +
                "<p>" + data.content + "</p>" +
                "</div>"
            );
            if(is_external){
                this.last_seen_id = data.id;
            }
        };

        Chat.prototype._clearLog = function (xhr, status) {
            if(status != "error"){
                $("#log").html("").css('display', 'none');
            }
        };

        Chat.prototype.showLog = function (message) {
            $("#log").html("").css('display', 'block');
            $("#log").html(message);
        };

        Chat.prototype.showError = function () {
            $("#log").html("").css('display', 'block');
            $("#log").html("Errooooooooooor");
        };

        return Chat;
    })();
});