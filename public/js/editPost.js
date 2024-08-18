// const usernameInput = document.querySelector("#username");
const titleInput = document.querySelector("#blogTitle");
const contentInput = document.querySelector("#blogContent");
const submit = document.querySelector("#submit");
const deleteP = document.querySelector("#deleteP");
const msgDiv = document.querySelector("#msg");

function displayMessage(type, message) {
  msgDiv.textContent = message;
  msgDiv.setAttribute("class", type);
}

submit.addEventListener("click", async function (event) {
    event.preventDefault();
    const blogTitle = titleInput.value;
    const blogContent = contentInput.value;
    const blogForm = document.getElementById("updateForm");
    const postId = blogForm.action.split('/').pop(); // Get the post ID from the form action URL
    let isError = false;

    if (blogTitle.trim() === "" || !blogTitle) {
        displayMessage("error", "Title cannot be blank");
        isError = true;
    } else if (blogContent.trim() === "" || !blogContent) {
        displayMessage("error", "Content cannot be blank");
        isError = true;
    } else {
        displayMessage("success", "Submitted successfully");
    }

    if (!isError) {
        const singlePost = {
            blogTitle: blogTitle,
            blogContent: blogContent,
            // dttm: new Date(),
        };
        console.log(`Fetching URL: /posts/${postId}`);

        const response = await fetch(`/api/posts/${postId}`, {
            method: 'PUT',
            body: JSON.stringify(singlePost),
            headers: { 'Content-Type': 'application/json' },
        });

        console.log(`/${postId}`);
        if (response.ok) {
            // window.location.href = `/dashboard`;
            res.redirect(`/dashboard`);
           
        } else {
            displayMessage("error", "Failed to update the post");
        }
    }
});



//////////////////////////
deleteP.addEventListener("click", async function (event) {
    event.preventDefault();

    const deleteForm = document.getElementById("deletePost");
    const postId = deleteForm.action.split('/').pop(); // Get the post ID from the form action URL

    const response = await fetch(`/posts/${postId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        window.location.href = `/dashboard`;
    } else {
        displayMessage("error", "Failed to delete the post");
    }
});
