(function () {$(document).ready(function () {

    var

        res = {
            INVALID: "As a **plain javascript** chatbot designed to answer questions with hard-coded responses, I cannot reply to this question you asked as it did not match any I could answer. I would recommend asking what I'm capable of so you can get the most out of me.",
            HELP: "Since I'm hard-coded to respond to specific questions and not to custom ones I will give you a list of responses I can answer:\n* What is NumberxNumber\n* Can you write a hello word function in javascript?\n* Hello\n* Can you generate an image?</ul>\nIf you want to add more then just [Fork](https://github.com/johnymcreed/Chatbot) this project on github.",
        }

        sendUser = (id, msg, identifier) => {
            $(id).append(`
                <div class="msg user">
                    <div class="inner" id="msg-user-${identifier}">
                        ${msg}
                    </div>
                </div>
            `)
        },

        sendBot = (id, identifier) => {
            $(id).append(`
                <div class="msg bot">
                    <div class="inner" id="msg-${identifier}">
                    </div>
                </div>
            `)
        },

        type = async (sentence, element, delay = 100) => {
            const scr = new showdown.Converter();
            scr.setOption('simpleLineBreaks', 'true');

            const letter = scr.makeHtml(sentence)
            let instance = 0;
            let fullString = ""
            let micro = async (m) => { return new Promise(resolve => setTimeout(resolve, m)) }
    
            // create bots message
            sendBot(element, $("#res div").length)
            
            while(instance < letter.length) {
                await micro(letter[instance].length+delay);
                
                // append any new letters to this string
                // this allows for **this** to be bolded automatically.
                fullString += letter[instance]
    
                // append
                $(`#msg-${$("#res div").length-2}`).html(fullString.replace(/(<p>|<\/p>)/img, ""));

                // continue
                instance++

                // scroll down
                $("#res").scrollTop($(".scrolled").height()*2*5*200)
                    
                if (instance < letter.length) {
                    $("#bot_send").prop("disabled", true)
                    $("#bot_send").addClass("disabled")
                } else {
                    $("#bot_send").prop("disabled", false)
                    $("#bot_send").removeClass("disabled")
                }
            }
    
            return;
        }

    // handles when you type in the input box
    $("#bot_input").on("keyup", function () {
        if ($(this).val().length > 100)
            $(this).height($(this).prop("scrollHeight")+"px")
        
        if ($(this).val().length == 0)
            $(this).height("inherit")
    })
    
    // handles when you click Enter NOT Shift+Enter
    $("#bot_input").keypress(function (e) {
        if(e.which === 13 && !e.shiftKey) {
            e.preventDefault();

            // prevent constant sending
            if (!$("#bot_send").prop("disabled")) {
                $("#bot_send").trigger("click");
                $(this).val("")
            }
        }
    });

    // handles when button is clicked
    // this is the complex function btw
    $("#bot_send").on("click", async function () {
        let input = $("#bot_input")
        let find = (text) => { return input.val().includes(text) }

        if (input.val().length == 0)
            return
            
        sendUser("#res", input.val().replace(/(<([^>]+)>)/gi, ""), $("#res div").length)

        // manage the message by the user 
        // this can take a while to we must wait during this process
        {
            let answer = "";

            // Help
            if ((find("what") || find("how")) && 
                (find("can") || find("are") || find("do") || find("is")) && 
                (find("you") || find("your") || find("ur")) && 
                (find("do") || find("work") || find("function") || find("capable") || find("perpose")))
                answer += res.HELP
            
            // Greet
            if ((find("hello") || find("hi") || find("heya") || find("heyo") || find("hey")) && !find("world"))
                answer += "Hi"

            // Math
            if ((find("can") || find("solve")) && (find("you") || find("for")) && (find("solve") || find("for"))) {
                let split = input.val().replace("?", "").replace("!", "").split(" ")
                let num1 = split.filter(num => isFinite(num))[0]
                let num2 = split.filter(num => isFinite(num))[1]

                answer += `Yes I can solve for that: **${num1}** x **${num2}** equals **${num1 * num2}**.`;
            }

            // Hello world function
            if ((find("can") || find("could")) && (find("you")) && (find("write") || find("make") || find("create")) && (find("a") || find("an")) && (find("javascript") || find("function") || find("hello world"))) {
                answer += "Yes I can write a hello world function in plain javascript:"

                answer += `\n\`\`\`\nlet string = "hello world!"\nconsole.log(string)\n\`\`\``

                answer += "\n The output should be **hello world!**."
            }

            // generate image
            if ((find("can") || find("could")) && (find("you")) && (find("generate"))) {
                let images = [
                    "https://global.discourse-cdn.com/codecademy/original/5X/3/c/8/5/3c85feecb4eb52a4d69ef0891cfbc495a1da7174.png",
                    "https://images7.memedroid.com/images/UPLOADED808/6368782c7bef3.jpeg",
                    "https://programmerhumor.io/wp-content/uploads/2022/08/programmerhumor-io-programming-memes-8b6642454f3cd20.jpg"
                ]

                let img = images[Math.floor(Math.random() * images.length)]

                answer += `Yes I can generate an image:\n ![Image](${img})`
            }

            answer.length ? type(answer, "#res", 20) : type(res.INVALID, "#res", 20)
        }
    })
})})();
