document.getElementById("createFile").addEventListener("click", createFile);
document.getElementById("readFile").addEventListener("click", readFile);
document.getElementById("removeFile").addEventListener("click", removeFile);

function createFile() {
    $.ajax({
        url: 'https://pt-wrap01.wni.co.jp/WRAP/wrap-pri/data/WX_JP_Lightning_Latest/latest70min.json',
        type: 'get',
        dataType: 'json'
    })
        .done(function (data) {
            var type = window.TEMPORARY;
            var size = 20 * 1024 * 1024;

            window.requestFileSystem(type, size, successCallback, errorCallback);

            function successCallback(fs) {
                fs.root.getFile('data.json', { create: true }, function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            alert('Write completed.');
                        };

                        fileWriter.onerror = function (e) {
                            alert('Write failed: ' + e.toString());
                        };

                        var blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
                        fileWriter.write(blob);
                    }, errorCallback);

                }, errorCallback);
            }

            function errorCallback(error) {
                alert("ERROR: " + error.code)
            }
        })
        .fail(function () {
            alert('REQUEST ERROR');
        });
}

function readFile() {
    var type = window.TEMPORARY;
    var size = 20 * 1024 * 1024;

    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {

        fs.root.getFile('data.json', {}, function (fileEntry) {

            fileEntry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (e) {
                    alert('Read completed.');
                    $('#viewArea').text(this.result);
                };

                reader.readAsText(file);

            }, errorCallback);

        }, errorCallback);
    }

    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }

}

function removeFile() {
    var type = TEMPORARY;
    var size = 20 * 1024 * 1024;

    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {
        fs.root.getFile('data.json', { create: false }, function (fileEntry) {

            fileEntry.remove(function () {
                alert('File removed.');
            }, errorCallback);

        }, errorCallback);
    }

    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }

}