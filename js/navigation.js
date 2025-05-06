document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const contentDiv = document.getElementById('content');

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Remove 'active' from all, then add to clicked link
            links.forEach(link => link.classList.remove('active'));
            link.classList.add('active');

            const contentKey = link.id;
            const filePath = `content/${contentKey}.html`;

            // Load content using fetch
            fetch(filePath)
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to load: ${filePath}`);
                    return response.text();
                })
                .then(html => {
                    // Insert raw HTML
                    contentDiv.innerHTML = html;

                    // Re-execute script tags
                    const scripts = contentDiv.querySelectorAll('script');
                    scripts.forEach(oldScript => {
                        const newScript = document.createElement('script');
                        if (oldScript.src) {
                            newScript.src = oldScript.src;
                            newScript.async = oldScript.async;
                        } else {
                            newScript.textContent = oldScript.textContent;
                        }
                        oldScript.replaceWith(newScript);
                    });
                })
                .catch(error => {
                    contentDiv.innerHTML = `<div class="alert alert-danger">Error loading content: ${error.message}</div>`;
                });
        });
    });
});