<script>
    let members = [
        { name: 'Daniel J', email: 'd*****@easierbycode.com', checkedIn: true },
        { name: 'Paul B', email: 'p*****@bunyan.com', checkedIn: true },
        { name: 'Willie W', email: 'w*****@wonka.com', checkedIn: false },
        { name: 'Optimus P', email: 'o*****@transformers.com', checkedIn: false },
        { name: 'Donald T', email: 'd*****@orangebologna.com', checkedIn: false }
    ]
</script>


<nav>
    <h1><span class='logo'>C43</span> CHECK-IN</h1>
</nav>

<ul>
{#each members as member}
<li>
    <span>{ member.name }</span>
    <span class="muted">{ member.email }</span>
    <button class='btn' class:muted={ member.checkedIn }>{ member.checkedIn ? 'Checked In' : 'Check In' }</button>
</li>
{/each}
</ul>


<style type="scss">
    @font-face {
        font-family: 'Teko';
        font-style: normal;
        font-weight: 400;
        src: local(''),
            url('/teko-v14-latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
    }

    :global(body) {
        background-color: #404042;
        color: #fafcfe;
        font-family: Arial,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;
        margin: 0;
    }
    :root {
        --header-height: 120px;
    }
    h1 {
        font-size: xx-large;
        letter-spacing: 0.091em;
        text-shadow: 0 1px rgb(250 252 254 / 65%);
        .logo {
            font-family: Teko;
        }
    }
    nav {
        background-color: #9D4284;
        color: #003100;
        height: var(--header-height);
        padding: 10px 25px;
    }
    ul {
        display: flex;
        flex-direction: column;
        font-size: 1.7em;
        height: calc(100vh - var(--header-height));
        justify-content: space-around;
        list-style: none;
        margin: 0;
        padding: 0 40px;
    }
    li {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .btn {
        color: rgb(201, 255, 251);
        background: linear-gradient(rgb(157 66 132) 0%, rgb(119,28,94) 100%);
        padding: 0.8rem 1rem 0.7rem;
        border: 0.2rem solid rgb(42,0,17);
        border-radius: 0.6rem;
        cursor: pointer;
        text-transform: capitalize;
    }
    .muted {
        opacity: 0.45;
    }
</style>