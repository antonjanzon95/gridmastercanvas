


export function renderFooter() {

    let footer = document.querySelector('#footer');
    footer.innerHTML = `
    FOOTER<br>
    <button id="user1">user1 localstorage</button><br>
    <button id="user2">user2 localstorage</button><br>
    <button id="user3">user3 localstorage</button><br>
    <button id="user4">user4 localstorage</button><br>
    `;

    const user1 = document.querySelector('#user1');
    user1.addEventListener('click', () => {
        localStorage.setItem('userName', 'User1');
        localStorage.setItem('userColor', 'blue');
    })

    const user2 = document.querySelector('#user2');
    user2.addEventListener('click', () => {
        localStorage.setItem('userName', 'User2');
        localStorage.setItem('userColor', 'red');
    })

    const user3 = document.querySelector('#user3');
    user3.addEventListener('click', () => {
        localStorage.setItem('userName', 'User3');
        localStorage.setItem('userColor', 'green');
    })

    const user4 = document.querySelector('#user4');
    user4.addEventListener('click', () => {
        localStorage.setItem('userName', 'User4');
        localStorage.setItem('userColor', 'black');
    })
    
}

