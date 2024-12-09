<?php
/**
 * @var \App\Packages\FoodAssistant\Models\UsersModel $user
 * @var int $room_id
 */
 $LANG_EXAMPLES = IT_EXAMPLES;
?>

<style>
   [data-role='example-template']{
        border: 1px solid #ddd;
        border-radius: .5rem;
        padding:.75rem;
        display:flex;
        align-items: center;
        justify-content: space-between;
        cursor:pointer;
        margin-bottom: .75rem;
        background:#fff;
   }

   h5{
    margin-top:1rem;
   }
</style>


<div class="container-fluid bg-light">
    <div class="row">
        <div class="col-lg-6 d-flex align-items-center justify-content-center d-none d-lg-block border-right">
            <h4 class="mt-5">Cosa puoi chiedere a Italo</h4>
            <div>
                <?php foreach ($LANG_EXAMPLES as $title => $examples) { ?>
                    <h5><?= $title ?></h5>

                    <?php foreach ($examples as $example) { ?>
                        <div data-role="example-template">
                            <div>

                            <?php
                                $parts = preg_split('/(\{.*?\})/', $example, -1, PREG_SPLIT_DELIM_CAPTURE);

                                foreach ($parts as $part) {
                                    if (preg_match('/\{(.+?)\}/', $part, $matches)) {
                                        // This is a placeholder
                                        $placeholder = htmlspecialchars($matches[1]);
                                        echo "<input type=\"text\" placeholder=\"$placeholder\"/>";
                                    } else {
                                        // This is regular text
                                        echo "<span>$part</span>";
                                    }
                                }
                            ?>
                            </div>
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    <?php } ?>
                <?php } ?>
            </div>
            <div>
               Per valutare la tua esperienza <a href="https://docs.google.com/forms/d/e/1FAIpQLSfA7U_uQvH_Ixlm0Cnx8Wx8_5ifaI1jmHfahU6286reQL3pzQ/viewform">clicca qui</a>.
            </div>

        </div>
        <div class="col-lg-6 px-0">
            <div class="d-flex flex-column" style="height:calc(100vh - 61px)">
                <div class="bg-primary text-white p-2">
                    <div class="d-flex align-items-center justify-content-between">
                    <span class="d-flex align-items-center">
                        <i class="ai-assistant-logo mr-2"></i>
                        <b>Food AI Assistant</b>
                    </span>
                        <div>
                            <button class="btn btn-link text-white" id="refresh-assistant-chat-btn">
                                <i class="fas fa-refresh"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="ai-assistant-react-root" class="flex-grow-1"></div>
            </div>

        </div>
    </div>
</div>
<?= assetOnce('lib/FuxFramework/FuxSwalUtility.js', 'script'); ?>
<?= assetOnce('lib/FuxFramework/FuxHTTP.js', 'script'); ?>
<?= assetOnce('lib/FuxFramework/FuxEvents.js', 'script'); ?>
<?= assetOnce('lib/moment/moment.js', 'script'); ?>
<?= assetOnce('lib/DOMPurify/purify.min.js', 'script'); ?>

<!-- Tippy.js -->
<?= assetOnce('lib/popper/popper-2.11.5.min.js', 'script'); ?>
<?= assetOnce('lib/tippyJS/tippy-bundle.min.js', 'script'); ?>
<?= assetOnce('lib/tippyJS/themes/light.css', 'CSS'); ?>

<!-- React JS -->
<?= assetOnce('lib/react/react.production.min.js', 'script'); ?>
<?= assetOnce('lib/react/react-dom.production.min.js', 'script'); ?>
<?= assetOnce('lib/react/prop-types.min.js', 'script'); ?>

<!-- Babel.js to use JSX -->
<?= assetOnce('lib/babel/babel.min.js', 'script'); ?>

<script>

    const WEB_SERVER_URL = '<?= routeFullUrl('') ?>';
    moment.locale('it');
    <?= \App\Packages\ReactJsBundler\ReactBundler::bundle("/AiAssistant/AiAssistantChatRoomView.jsx", true) ?>

    (function (room_id) {
        function render(room_id) {
            ReactDOM.unmountComponentAtNode(document.getElementById('ai-assistant-react-root'))
            ReactDOM.render(
                React.createElement(AiAssistantChatRoomView, {
                    roomId: room_id,
                    idSelf: <?= $user->chat_user_id ?>
                }),
                document.getElementById('ai-assistant-react-root')
            );
        }

        const refreshChatBtn = document.getElementById('refresh-assistant-chat-btn');

        refreshChatBtn.addEventListener('click', _ => {
            FuxSwalUtility.confirm('Are you sure you want to delete the current conversation? All your preferences will be deleted as well')
                .then(_ => {
                    FuxHTTP.post('<?= routeFullUrl('/ai-assistant/chat/refresh-chat-room') ?>', {}, FuxHTTP.RESOLVE_DATA, FuxHTTP.REJECT_MESSAGE)
                        .then(room_id => {
                            render(room_id);
                        })
                        .catch(FuxSwalUtility.error);
                });
        });

        render(room_id);
    })(<?= $room_id ?>);


    document.querySelectorAll('[data-role="example-template"]').forEach(function(t) {
        t.addEventListener('click', e => {
            if(e.target.tagName == 'INPUT') return;

            let msg = '';
            t.querySelectorAll('div > span,input').forEach(s => {
                console.log(s);
                msg += s.tagName == 'INPUT' ? s.value : s.innerHTML;
            });

            console.log(msg);
            FuxEvents.emit('__chat_message__',msg);
        });
    });
</script>
