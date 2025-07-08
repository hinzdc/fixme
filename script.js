document.addEventListener('DOMContentLoaded', () => {
    const problemInput = document.getElementById('problemInput');
    const searchButton = document.getElementById('searchButton');
    const solutionText = document.getElementById('solutionText');

    // API Key Anda (HANYA UNTUK DEMO!)
    const apiKey = "AIzaSyD69ePjrEltfUKrTL7XcbAs0xtq1t_q1FU";

    searchButton.addEventListener('click', async () => {
        const problem = problemInput.value;

        if (problem.trim() === '') {
            alert('Mohon masukkan deskripsi masalah.');
            return;
        }

        solutionText.textContent = 'Sedang mencari solusi...';

        try {
            const solution = await getGeminiSolution(problem, apiKey);
            solutionText.textContent = ''; // Bersihkan teks "Loading..."
            typeWriter(solutionText, solution); // Mulai animasi typing
        } catch (error) {
            console.error('Error:', error);
            solutionText.textContent = 'Terjadi kesalahan saat mencari solusi.';
        }
    });

    // Fungsi untuk mendapatkan solusi dari Gemini API
    async function getGeminiSolution(problem, apiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        const data = {
            contents: [{
                parts: [{ text: `Berikan solusi troubleshooting untuk masalah Windows berikut: ${problem}. Berikan langkah-langkah yang jelas dan mudah diikuti. Gunakan format markdown jika perlu untuk heading, list dan lain-lain.` }]
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData);
        const solution = responseData.candidates[0].content.parts[0].text;
        return solution;
    }

    // Fungsi untuk efek typing
    function typeWriter(element, text, i = 0) {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            setTimeout(() => typeWriter(element, text, i + 1), 20); // Kecepatan typing
        }
    }
});
