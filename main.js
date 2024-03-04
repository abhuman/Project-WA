document.getElementById('analyze-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const url = document.getElementById('url').value;
    fetch('/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    }).then(() => {
        window.location.reload();
    });
});

document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const csvFile = document.getElementById('csv').files[0];
    const formData = new FormData();
    formData.append('csv', csvFile);
    fetch('/upload', {
        method: 'POST',
        body: formData
    }).then(() => {
        window.location.reload();
    });
});