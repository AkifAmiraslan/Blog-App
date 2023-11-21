document.addEventListener('DOMContentLoaded', function () {
    const addBlogBtn = document.querySelector(".add-blog-btn");
    const modal = document.querySelector(".modal");
    const titleInput = document.getElementById("titleInput");
    const contentInput = document.getElementById("contentInput");
    const dateInput = document.getElementById("dateInput");
    const submitBtn = document.getElementById("submitBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const blogsContainer = document.querySelector('.blogs-container');

    addBlogBtn.addEventListener("click", openModal);
    submitBtn.addEventListener("click", submitBlog);
    cancelBtn.addEventListener("click", closeModal);

    function openModal() {
        titleInput.value = "";
        contentInput.value = "";
        dateInput.value = "";
        modal.classList.add("show-modal");
    }

    function closeModal() {
        modal.classList.remove("show-modal");
    }

    function submitBlog() {
        const title = titleInput.value;
        const content = contentInput.value;
        const date = dateInput.value;
        function generateRandomId() {
            return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        }
        if (title && content && date) {
            const newBlog = {
                title,
                content,
                date,
                id : generateRandomId()
            };

            fetch('http://localhost:3000/blogPosts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBlog),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Successfully added new blog:', data);
                    closeModal();
                    loadBlogData();
                })
                .catch(error => {
                    console.error('Error adding new blog:', error);
                });
        }else{
            alert("enter title, content, date before submit")
        }
    }

    function loadBlogData() {
        fetch('http://localhost:3000/blogPosts')
            .then(response => response.json())
            .then(blogData => {
                displayBlogPosts(blogData);
            })
            .catch(error => {
                console.error('Error loading blog data:', error);
            });
    }

    function displayBlogPosts(blogData) {
        blogsContainer.innerHTML = '';

        blogData.forEach(post => {
            const article = document.createElement('article');
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <p class="date">Published on: ${post.date}</p>
                <div class="delete-btn" data-id="${post.id}">Delete</div>
            `;
            article.querySelector('.delete-btn').addEventListener('click', () => deleteBlog(post.id));
            blogsContainer.appendChild(article);
        });
    }

    function deleteBlog(blogId) {
        const confirmDelete = confirm('Are you sure you want to delete this blog?');
        if (confirmDelete) {
            fetch(`http://localhost:3000/blogPosts/${blogId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Successfully deleted blog:', data);
                    loadBlogData();
                })
                .catch(error => {
                    console.error('Error deleting blog:', error);
                });
        }
    }

    // İlk yükləmə zamanı məlumatları göstərmək üçün
    loadBlogData();
});
