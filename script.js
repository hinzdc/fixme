document.addEventListener('DOMContentLoaded', () => {
    const problemInput = document.getElementById('problemInput');
    const searchButton = document.getElementById('searchButton');
    const solutionContainer = document.getElementById('solutionContainer');
    const solutionText = document.getElementById('solutionText');
    const loader = document.getElementById('loader');

    // Kunci API Anda.
    const apiKey = "AIzaSyD69ePjrEltfUKrTL7XcbAs0xtq1t_q1FU";

    searchButton.addEventListener('click', async () => {
        const problem = problemInput.value;

        if (problem.trim() === '') {
            alert('Mohon masukkan deskripsi masalah.');
            return;
        }

        loader.classList.remove('hidden');
        solutionContainer.classList.add('hidden');
        solutionText.innerHTML = '';

        try {
            const solution = await getGeminiSolution(problem, apiKey);
            displaySolution(solution);
        } catch (error) {
            console.error('Error:', error);
            displayError(error.message);
        }
    });

    // Add event listener for Enter key
    problemInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // Prevent the default action (like form submission)
            event.preventDefault();
            // Trigger the search button's click event
            searchButton.click();
        }
    });

    async function getGeminiSolution(problem, apiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const data = {
            contents: [{
                parts: [{
                    text: `Berikan solusi troubleshooting untuk masalah Windows berikut: ${problem}. Berikan langkah-langkah yang jelas, mudah diikuti dan rinci. Jangan gunakan format markdown. Jika ingin menebalkan kata gunakan tag html <bold>tebal</bold>. Untuk membuat list gunakan html list ordered dan unordered. contoh <ol><li>list 1</li><li>list 2</li></ol> `
                }]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.error.message}`);
        }

        const responseData = await response.json();
        if (!responseData.candidates || !responseData.candidates[0].content.parts[0].text) {
            throw new Error("Tidak ada solusi yang ditemukan dari API.");
        }
        return responseData.candidates[0].content.parts[0].text;
    }

    function displaySolution(solution) {
        loader.classList.add('hidden');
        const formattedSolution = formatSolution(solution);
        solutionText.innerHTML = formattedSolution;
        solutionContainer.classList.remove('hidden');
    }

    function displayError(errorMessage) {
        loader.classList.add('hidden');
        solutionText.innerHTML = `<p class="error-message">${errorMessage}</p>`;
        solutionContainer.classList.remove('hidden');
    }

    function formatSolution(solution) {
        let formattedSolution = solution.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedSolution = formattedSolution.replace(/\*(.*?)\*/g, '<em>$1</em>');
        formattedSolution = formattedSolution.replace(/\n/g, '<br>');
        return formattedSolution;
    }
});