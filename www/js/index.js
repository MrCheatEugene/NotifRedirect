document.addEventListener('deviceready', onDeviceReady, false);

const save = ()=>{
    localStorage.setItem('data', JSON.stringify({'passphrase': passphrase.value, 'script': document.getElementById('script').value}))
};

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    let r = JSON.parse(localStorage.getItem('data'));
    passphrase.value = r['passphrase'];
    script.value = r['script'];
    
    cordova.plugins.backgroundMode.on('onSMSArrive', onSMSArrive);
    document.addEventListener('onSMSArrive', onSMSArrive);

    var notificationListener = cordova.plugins.NotificationListener;
    notificationListener.hasPermission(() => { }, () => {
        alert("Разрешите, пожалуйста прослушивание уведомлений");
        notificationListener.requestPermission(() => { }, () => { window.close(); });
    });
    notificationListener.isRunning((status) => {
        if (!status.isRunning) {
            notificationListener.toggle();
        }
    }, () => {});
    
    notificationListener.addListener((e) => { 
        let data = e;
        document.getElementById('lastnum').innerText = data['package'];
        fetch(`${script.value}?passphrase=${encodeURIComponent(passphrase.value)}&sms=${encodeURIComponent(data['title']+" " + data['text'])}&number=${data['package']}`);
    }, (e) => {
        console.log(e)
        alert("Ошибка при привязке хэндлера..");
    });

}


const onSMSArrive = (e)=>{
    var data = e.data;
    console.log(e);
    document.getElementById('lastnum').innerText = data['address'];
    fetch(`${script.value}?passphrase=${encodeURIComponent(passphrase.value)}&sms=${encodeURIComponent(data['body'])}&number=${data['address']}`);
}