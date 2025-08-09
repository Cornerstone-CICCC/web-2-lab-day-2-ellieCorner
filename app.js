$(function () {
  let currentUserId = 1;
  const totalUsers = 30;

  loadUser(currentUserId);

  $("header button")
    .eq(0)
    .on("click", function () {
      currentUserId = currentUserId === 1 ? totalUsers : currentUserId - 1;
      loadUser(currentUserId);
    });

  $("header button")
    .eq(1)
    .on("click", function () {
      currentUserId = currentUserId === totalUsers ? 1 : currentUserId + 1;
      loadUser(currentUserId);
    });

  $(".posts h3, .todos h3").on("click", function () {
    $(this).next("ul").slideToggle();
  });

  function loadUser(id) {
    getUser(id);
    getPosts(id);
    getTodos(id);
  }

  function getUser(id) {
    $.ajax({
      url: `https://dummyjson.com/users/${id}`,
      method: "GET",
      success: function (user) {
        $(".info__image img").attr("src", user.image);
        $(".info__content").html(`
          <h2>${user.firstName} ${user.lastName}</h2>
          <p><strong>Age:</strong> ${user.age}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone}</p>
        `);
        currentFirstName = user.firstName;
      },
    });
  }

  function getPosts(id) {
    $.ajax({
      url: `https://dummyjson.com/users/${id}/posts`,
      method: "GET",
      success: function (res) {
        const posts = res.posts;
        $(".posts h3").text(`${currentFirstName}'s Posts`);
        const $ul = $(".posts ul").empty();

        if (posts.length === 0) {
          $("<li>").text(`User has no posts`).appendTo($ul);
          return;
        }

        posts.forEach((post) => {
          const $title = $("<h4>")
            .text(post.title)
            .css("text-decoration", "underline")
            .css("cursor", "pointer")
            .on("click", function () {
              openPostModal(post.id);
            });

          const $body = $("<p>").text(post.body);

          $("<li>").append($title).append($body).appendTo($ul);
        });
      },
    });
  }

  function getTodos(id) {
    $.ajax({
      url: `https://dummyjson.com/users/${id}/todos`,
      method: "GET",
      success: function (res) {
        const todos = res.todos;
        $(".todos h3").text(`${currentFirstName}'s To Dos`);
        const $ul = $(".todos ul").empty();

        if (todos.length === 0) {
          $("<li>").text(`User has no todos`).appendTo($ul);
          return;
        }

        todos.forEach((todo) => {
          $("<li>").html(`${todo.todo}`).appendTo($ul);
        });
      },
    });
  }

  function openPostModal(postId) {
    $.ajax({
      url: `https://dummyjson.com/posts/${postId}`,
      method: "GET",
      success: function (post) {
        const $modal = $(`
          <div class="overlay">
            <div class="modal">
              <h2>${post.title}</h2>
              <p>${post.body}</p>
              <p><strong>Views:</strong> ${post.views}</p>
              <button>Close Modal</button>
            </div>
          </div>
        `);

        $("body").append($modal);

        $modal.find("button").on("click", function () {
          $modal.remove();
        });

        $modal.on("click", function (e) {
          if (e.target === this) $modal.remove();
        });
      },
    });
  }
});
