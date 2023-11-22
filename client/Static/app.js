document.getElementById('authNbutton').addEventListener('click', async ()=> {

        const response = await fetch('http://localhost:8888/login', {method: 'GET'});

        if (response.ok){
            const result = await response.json();
            console.log('Authentication URL:', result.authenticationUrl);
            window.location.href = result.authenticationUrl;
        }else{
            console.error('Failed to initiate OIDC flow', response.statusText);
        }
})