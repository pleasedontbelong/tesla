$(function() {
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


    var Chat = (function () {
        function Chat(user) {
            this.user = user;
            this.interval = setInterval(this.getMessages.bind(this), 3000);
            this.last_seen_id = 3;
            this.chart_content = $('#chat-content')[0];
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
                url: "/api/messages/list/" + this.user + "/" + this.last_seen_id
            }).done(this.processMessages.bind(this)).fail(this.showError.bind(this));
        };
        Chat.prototype.sendMessage = function () {
            var data = $('form.message').serializeArray();
            data = data[0];
            if(data.value.trim().length > 0){
                this.addMessage({
                    user: this.user,
                    content: data.value,
                    created: new Date()
                });
                $('form.message textarea').val('');
            }
        };

        Chat.prototype.processMessages = function (messages) {
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
            
        };

        Chat.prototype.showError = function () {
            console.log("showError");
            console.log(arguments);
        };

        return Chat;
    })();
});