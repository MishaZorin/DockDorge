import './App.css'
import { useState } from 'react';

const API_URL = 'http://localhost:3000';

export default function App() {
  const [imgBackValue, setImgBackValue] = useState('')
  const [imgFrontValue, setImgFrontValue] = useState('')
  const [externalPortBack, setExternalPortBack] = useState('')
  const [internalPortBack, setInternalPortBack] = useState('')
  const [generatedTemplate, setGeneratedTemplate] = useState('')
  const [externalPortFront, setExternalPortFront] = useState('')
  const [internalPortFront, setInternalPortFront] = useState('')
  const [containerNameBack, setContainerNameBack] = useState('')
  const [containerNameFront, setContainerNameFront] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [output, setOutput] = useState('')
  const payload = {
    imgBackValue,
    imgFrontValue,
    containerNameBack,
    containerNameFront,
    externalPortBack,
    internalPortBack,
    externalPortFront,
    internalPortFront
  };


  const createEnv = async () => {
    try {
      const res = await fetch(`${API_URL}/envs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: inputValue }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)


    } catch (err) {
      console.error(err)
    }
  }
  const getDecryptedEnv = async () => {
    try {
      const res = await fetch(`${API_URL}/envs`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },

      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data: { id: number; value: string }[] = await res.json()
      setOutput(data.map((e) => e.value).join('\n'))
    } catch (err) {
      console.error(err)
    }

  }

  const sendData = async () => {

    const response = await fetch(`${API_URL}/generator/compose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });


    const data = await response.json();


    console.log(data.template);
    setGeneratedTemplate(data.template);
  };


  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="28" height="28" rx="8" stroke="#5B9DFF" strokeWidth="2" />
              <path
                d="M9 20h14M9 15h6M17 15h6M13 10h6"
                stroke="#5B9DFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="logo-name">Dockforge</span>
          </div>
        </header>

        <main className="env">
          <section className="card">
            <h1 className="card-title">Создание .env</h1>
            <p className="card-text">
              Впиши или вставь переменные окружения, по одной на строку в формате KEY=value.
            </p>

            <label className="sr-only" htmlFor="env-input">
              Содержимое .env
            </label>
            <textarea
              className="textarea"
              id="env-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={"DB_HOST=localhost\nDB_PORT=5432"}
              spellCheck={false}
            />

            <div className="actions">
              <button className="btn btn-primary" type="button" onClick={() => createEnv()}>
                Создать запись
              </button>
            </div>
          </section>

          <section className="card output">
            <div className="output-head">
              <span className="file-name">.env</span>
              <button className="btn btn-small" type="button" onClick={() => getDecryptedEnv()}>
                Вывести
              </button>
            </div>
            <pre className="code">
              <code>{output}</code>
            </pre>
          </section>
          <section className="card">
            <h2 className="card-title">Генератор Dockerfile</h2>
            <p className="card-text">
              Добавь образы бэкенда и фронтенда, укажи порты и параметры сборки.
            </p>

            <fieldset className="field">
              <legend className="field-label">Образы</legend>

              <div className="service-list">
                <div className="service">
                  <div className="service-head">
                    <span className="badge badge-backend">Backend</span>

                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="name-backend">Имя контейнера</label>
                    <input
                      className="input"
                      id="name-backend"
                      type="text"
                      placeholder="my-backend"
                      spellCheck={false}
                      value={containerNameBack}
                      onChange={(e) => setContainerNameBack(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="img-backend">Образ</label>
                    <input
                      className="input"
                      id="img-backend"
                      type="text"
                      placeholder="myuser/backend:latest"
                      spellCheck={false}
                      value={imgBackValue}
                      onChange={(e) => setImgBackValue(e.target.value)}
                    />
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label className="field-label" htmlFor="ext-backend">
                        Внешний порт (хост)
                      </label>
                      <input
                        className="input"
                        id="ext-backend"
                        min={1}
                        max={65535}
                        defaultValue={3000}
                        value={externalPortBack}
                        onChange={(e) => setExternalPortBack(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label className="field-label" htmlFor="int-backend">
                        Внутренний порт (контейнер)
                      </label>
                      <input
                        className="input"
                        id="int-backend"

                        min={1}
                        max={65535}
                        defaultValue={3000}
                        value={internalPortBack}
                        onChange={(e) => setInternalPortBack(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="service">
                  <div className="service-head">
                    <span className="badge badge-frontend">Frontend</span>
                    \
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="name-frontend">Имя контейнера</label>
                    <input
                      className="input"
                      id="name-frontend"
                      type="text"
                      placeholder="my-frontend"
                      spellCheck={false}
                      value={containerNameFront}
                      onChange={(e) => setContainerNameFront(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="img-frontend">Образ</label>
                    <input
                      className="input"
                      id="img-frontend"
                      type="text"
                      placeholder="myuser/frontend:latest"
                      spellCheck={false}
                      value={imgFrontValue}
                      onChange={(e) => setImgFrontValue(e.target.value)}
                    />
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label className="field-label" htmlFor="ext-frontend">
                        Внешний порт (хост)
                      </label>
                      <input
                        className="input"
                        id="ext-frontend"

                        min={1}
                        max={65535}
                        defaultValue={8080}
                        value={externalPortFront}
                        onChange={(e) => setExternalPortFront(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label className="field-label" htmlFor="int-frontend">
                        Внутренний порт (контейнер)
                      </label>
                      <input
                        className="input"
                        id="int-frontend"

                        min={1}
                        max={65535}
                        defaultValue={80}
                        value={internalPortFront}
                        onChange={(e) => setInternalPortFront(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="add-row">
                <button className="btn btn-dashed" type="button">
                  + Образ бэкенда
                </button>
                <button className="btn btn-dashed" type="button">
                  + Образ фронтенда
                </button>
              </div> */}
            </fieldset>

            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="df-manager">Менеджер пакетов</label>
                <select className="select" id="df-manager" defaultValue="npm">
                  <option value="npm">npm</option>
                  <option value="pnpm">pnpm</option>
                  <option value="yarn">yarn</option>
                </select>
              </div>
              <div className="field">
                <label className="field-label" htmlFor="df-cmd">Команда запуска</label>
                <input
                  className="input"
                  id="df-cmd"
                  type="text"
                  placeholder="node dist/main.js"
                  spellCheck={false}
                />
              </div>
            </div>

            <fieldset className="field">
              <legend className="field-label">Параметры</legend>
              <div className="check-list">
                <label className="check">
                  <input type="checkbox" defaultChecked />
                  <span>Multi-stage сборка</span>
                </label>
                <label className="check">
                  <input type="checkbox" defaultChecked />
                  <span>Запуск не от root</span>
                </label>
                <label className="check">
                  <input type="checkbox" />
                  <span>HEALTHCHECK</span>
                </label>
                <label className="check">
                  <input type="checkbox" defaultChecked />
                  <span>Создать .dockerignore</span>
                </label>
              </div>
            </fieldset>

            <div className="actions">
              <button className="btn btn-primary" type="button" onClick={() => sendData()}>
                Сгенерировать Dockerfile
              </button>
            </div>
          </section>
          {generatedTemplate && (
            <section className="card result">
              <div className="result-head">
                <span className="result-dots" aria-hidden="true">
                  <i /><i /><i />
                </span>
                <span className="file-name">docker-compose.yml</span>
              </div>
              <pre className="result-code">
                <code>{generatedTemplate}</code>
              </pre>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}