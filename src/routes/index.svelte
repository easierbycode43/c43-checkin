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
    <h1>CHECK-IN</h1>
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


<style>
    :global(body) {
        background-color: black;
        color: #fafcfe;
        font-family: Arial,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;
        margin: 0;
    }
    :root {
        --header-height: 120px;
    }
    h1 {
        text-shadow: 0 1px rgb(250 252 254 / 65%);
        letter-spacing: 1.3px;
    }
    nav {
        background-color: #23a455;
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
        background: linear-gradient(rgb(35, 164, 85) 0%, rgb(0, 126, 47) 100%);
        padding: 0.8rem 1rem 0.7rem;
        border: 0.2rem solid rgb(0, 126, 47);
        cursor: pointer;
        text-transform: capitalize;
    }
    .muted {
        opacity: 0.45;
    }
</style>