const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const _id = urlParams.get("_id");
const keyword = urlParams.get("keyword");

function signOut() {
  localStorage.clear();
  window.location.href = '/';
}

function getSelf(callback) {
  $.ajax({
    type: 'GET',
    url: '/api/users/me',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    success: function (response) {
      callback(response.user);
    },
    error: function (xhr, status, error) {
      console.log(status, error);
      if (status == 401) {
        alert('로그인이 필요합니다.');
      } else {
        localStorage.clear();
        alert('로그인이 필요합니다.');
      }
      window.location.href = '/';
    },
  });
}

function loginState() {
  const isToken = localStorage.getItem('token');
  if (isToken) {
    $('.login').css('display', 'none');
    $('.logout').css('display', 'block');
  } else {
    $('.login').css('display', 'block');
    $('.logout').css('display', 'none');
  }
}

function correct_detail() {
  $.ajax({
      type: "GET",
      url: `/api/posts/correction/${_id}`,
      headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {},
      error: function (xhr, status, error) {
          if (status == 401) {
              alert('로그인이 필요합니다.')
          }
          window.location.href = "/";
      },                
      success: function (response) {
          let post = response["post"];
          
          $("#title").val(post["title"]);
          $("#content").text(post["content"]);
      }
  });
}

function correction() {
  $.ajax({
      type: "PATCH",
      url: `/api/posts/correction/${_id}`,
      headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
          title: $("#title").val(),
          content: $("#content").val(),
      },
      error: function (xhr, status, error) {
          if (status == 401) {
              alert('로그인이 필요합니다.')
          }
          window.location.href = "/";
      },
      success: function (response) {
          if (response["result"] == "success") {
              alert("변경 완료!");
              window.location.href = "/";
          }
      }
  });
}

function delete_post() {

  $.ajax({
      type: "DELETE",
      url: `/api/posts/delete/${_id}`,
      headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {},
      error: function (xhr, status, error) {
          if (status == 401) {
              alert('로그인이 필요합니다.')
          }
          window.location.href = "/";
      },
      success: function (response) {
          if (response["result"] == "success") {
              alert("삭제 완료!");
              window.location.href = "/";
          }
      }
  });
}
