// const usernameInput = document.querySelector("#username");
const titleInput = document.querySelector("#blogTitle");
const contentInput = document.querySelector("#blogContent");
const submit = document.querySelector("#submit");
const msgDiv = document.querySelector("#msg");

function displayMessage(type, message) {
  msgDiv.textContent = message;
  msgDiv.setAttribute("class", type);
}

submit.addEventListener("click", async function (event) {
  event.preventDefault();
//   const username = usernameInput.value;
  const blogTitle = titleInput.value;
  const blogContent = contentInput.value;
  const blogForm = document.getElementById("blogForm");
  let isError = false;

//   if (username.trim() === "" || !username) {
//     console.log("username+++++", username);
//     displayMessage("error", "Username cannot be blank");
//     isError = true;
   if (blogTitle.trim() === "" || !blogTitle) {
    displayMessage("error", "Title cannot be blank");
    isError = true;
  } else if (blogContent.trim() === "" || !blogContent) {
    displayMessage("error", "Content cannot be blank");
    isError = true;
  } else {
    displayMessage("success", "Submitted successfully");
  }

  // if there is not an error then create the array
  // add dttm field
  if (!isError) {

    // declare variable for the json object for indiviual post
    const singlePost = {
    //   username: username.value,
      blogTitle: blogTitle,
      blogContent: blogContent,
      dttm: new Date(),
    };
const response = await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify(singlePost),
    headers: { 'Content-Type': 'application/json' },
  });

  window.location.href = `/dashboard`;
    // blogForm.reset();
    // window.location.href = "blog.html";
  }
});
