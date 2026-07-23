import React, { useState, useEffect } from 'react';
import './App.css'; // Vamos criar este arquivo para estilização

function App() {
  const [perguntaAtual, setPerguntaAtual] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [respostaEnviada, setRespostaEnviada] = useState(false);

  // Função para buscar uma nova pergunta da API
  const buscarPergunta = async () => {
    setCarregando(true);
    setFeedback('');
    setPerguntaAtual(null);
    setRespostaEnviada(false);

    try {
      const response = await fetch('/api/pergunta');
      const data = await response.json();
      setPerguntaAtual(data);
    } catch (error) {
      console.error("Erro ao buscar pergunta:", error);
      setFeedback('Erro ao carregar a pergunta. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // useEffect para buscar a primeira pergunta quando o componente montar
  useEffect(() => {
    buscarPergunta();
  }, []);

  // Função para lidar com o clique em uma alternativa
  const handleRespostaClick = async (alternativa) => {
    if (respostaEnviada) return; // Impede múltiplos cliques

    setRespostaEnviada(true);

    try {
      const response = await fetch('/api/verificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          perguntaId: perguntaAtual.id,
          resposta: alternativa,
        }),
      });
      const resultado = await response.json();

      if (resultado.correto) {
        setFeedback('Correto! 🎉');
      } else {
        setFeedback('Incorreto. Tente a próxima! 😥');
      }
    } catch (error) {
      console.error("Erro ao verificar resposta:", error);
      setFeedback('Erro ao verificar a resposta.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quiz Interativo</h1>
      </header>
      <main className="quiz-container">
        {carregando && <p>Carregando pergunta...</p>}
        
        {perguntaAtual && (
          <>
            <h2>{perguntaAtual.pergunta}</h2>
            <div className="alternativas-grid">
              {perguntaAtual.alternativas.map((alt, index) => (
                <button
                  key={index}
                  className="alternativa-btn"
                  onClick={() => handleRespostaClick(alt)}
                  disabled={respostaEnviada}
                >
                  {alt}
                </button>
              ))}
            </div>
          </>
        )}

        {feedback && (
          <div className="feedback-container">
            <p className={`feedback ${feedback.includes('Correto') ? 'correto' : 'incorreto'}`}>
              {feedback}
            </p>
            <button onClick={buscarPergunta} className="proxima-btn">
              Próxima Pergunta
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;