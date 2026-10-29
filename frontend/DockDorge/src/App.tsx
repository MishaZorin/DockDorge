import './App.css';
import { useState } from 'react';
import type { ChangeEvent } from 'react';

const API_URL = 'http://localhost:3000';

export default function App() {
  const [imgBackValue, setImgBackValue] = useState('');
  const [imgFrontValue, setImgFrontValue] = useState('');
  const [externalPortBack, setExternalPortBack] = useState('3000');
  const [internalPortBack, setInternalPortBack] = useState('3000');
  const [externalPortFront, setExternalPortFront] = useState('8080');
  const [internalPortFront, setInternalPortFront] = useState('80');
  const [containerNameBack, setContainerNameBack] = useState('');
  const [containerNameFront, setContainerNameFront] = useState('');
  const [generatedTemplate, setGeneratedTemplate] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const [packageManager, setPackageManager] = useState('npm');
  const [command, setCommand] = useState('node dist/main.js');
  const [multiStage, setMultiStage] = useState(true);
  const [nonRoot, setNonRoot] = useState(true);
  const [healthcheck, setHealthcheck] = useState(false);
  const [dockerignore, setDockerignore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Универсальный обработчик чекбоксов
  const handleCheckboxChange =
    (setter: (checked: boolean) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  const createEnv = async () => {
    try {
      setError('');

      const res = await fetch(`${API_URL}/envs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: inputValue }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setError('Файл .env успешно сохранён');
    } catch (err) {
      console.error('Ошибка создания .env:', err);
      setError('Не удалось сохранить .env. Проверь, запущен ли backend.');
    }
  };

  const getDecryptedEnv = async () => {
    try {
      setError('');

      const res = await fetch(`${API_URL}/envs`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: { id: number; value: string }[] = await res.json();
      setOutput(data.map((e) => e.value).join('\n'));
    } catch (err) {
      console.error('Ошибка получения .env:', err);
      setError('Не удалось получить .env.');
    }
  };

  const sendData = async () => {
    setError('');

    if (
      !imgBackValue.trim() ||
      !imgFrontValue.trim() ||
      !containerNameBack.trim() ||
      !containerNameFront.trim() ||
      !externalPortBack ||
      !internalPortBack ||
      !externalPortFront ||
      !internalPortFront ||
      !command.trim()
    ) {
      setError('Заполни все поля конфигурации перед генерацией.');
      return;
    }

    const ports = [
      externalPortBack,
      internalPortBack,
      externalPortFront,
      internalPortFront,
    ];

    if (
      ports.some((port) => {
        const value = Number(port);
        return !Number.isInteger(value) || value < 1 || value > 65535;
      })
    ) {
      setError('Порты должны быть целыми числами от 1 до 65535.');
      return;
    }

    if (containerNameBack.trim() === containerNameFront.trim()) {
      setError('Имена Backend и Frontend должны различаться.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        imgBackValue: imgBackValue.trim(),
        imgFrontValue: imgFrontValue.trim(),
        containerNameBack: containerNameBack.trim(),
        containerNameFront: containerNameFront.trim(),
        externalPortBack,
        internalPortBack,
        externalPortFront,
        internalPortFront,
        packageManager,
        command: command.trim(),
        multiStage,
        nonRoot,
        healthcheck,
        dockerignore,
      };

      const response = await fetch(`${API_URL}/generator/compose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: { template: string } = await response.json();

      if (typeof data.template !== 'string') {
        throw new Error('Backend не вернул поле template');
      }

      setGeneratedTemplate(data.template);
    } catch (err) {
      console.error('Ошибка генерации конфигурации:', err);
      setError(
        'Не удалось сгенерировать конфигурацию. Проверь backend и его endpoint.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="logo">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="2"
                width="28"
                height="28"
                rx="8"
                stroke="#5B9DFF"
                strokeWidth="2"
              />
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
          {/* Создание .env */}
          <section className="card">
            <h1 className="card-title">Создание .env</h1>

            <p className="card-text">
              Впиши или вставь переменные окружения, по одной на строку
              в формате KEY=value.
            </p>

            <label className="sr-only" htmlFor="env-input">
              Содержимое .env
            </label>

            <textarea
              className="textarea"
              id="env-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={'DB_HOST=localhost\nDB_PORT=5432'}
              spellCheck={false}
            />

            <div className="actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={createEnv}
              >
                Создать запись
              </button>
            </div>
          </section>

          {/* Просмотр .env */}
          <section className="card output">
            <div className="output-head">
              <span className="file-name">.env</span>

              <button
                className="btn btn-small"
                type="button"
                onClick={getDecryptedEnv}
              >
                Вывести
              </button>
            </div>

            <pre className="code">
              <code>{output}</code>
            </pre>
          </section>

          {/* Генератор Docker-конфигурации */}
          <section className="card">
            <h2 className="card-title">Генератор Dockerfile</h2>

            <p className="card-text">
              Настрой контейнеры, порты и параметры сборки.
            </p>

            <fieldset className="field">
              <legend className="field-label">Образы и контейнеры</legend>

              <div className="service-list">
                {/* Backend */}
                <div className="service">
                  <div className="service-head">
                    <span className="badge badge-backend">Backend</span>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="name-backend">
                      Имя контейнера
                    </label>
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
                    <label className="field-label" htmlFor="img-backend">
                      Путь к сборке
                    </label>
                    <input
                      className="input"
                      id="img-backend"
                      type="text"
                      placeholder="./backend"
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
                        type="number"
                        min={1}
                        max={65535}
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
                        type="number"
                        min={1}
                        max={65535}
                        value={internalPortBack}
                        onChange={(e) => setInternalPortBack(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Frontend */}
                <div className="service">
                  <div className="service-head">
                    <span className="badge badge-frontend">Frontend</span>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="name-frontend">
                      Имя контейнера
                    </label>
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
                    <label className="field-label" htmlFor="img-frontend">
                      Путь к сборке
                    </label>
                    <input
                      className="input"
                      id="img-frontend"
                      type="text"
                      placeholder="./frontend"
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
                        type="number"
                        min={1}
                        max={65535}
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
                        type="number"
                        min={1}
                        max={65535}
                        value={internalPortFront}
                        onChange={(e) => setInternalPortFront(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Настройки сборки */}
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="df-manager">
                  Менеджер пакетов
                </label>
                <select
                  className="select"
                  id="df-manager"
                  value={packageManager}
                  onChange={(e) => setPackageManager(e.target.value)}
                >
                  <option value="npm">npm</option>
                  <option value="pnpm">pnpm</option>
                  <option value="yarn">yarn</option>
                </select>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="df-cmd">
                  Команда запуска
                </label>
                <input
                  className="input"
                  id="df-cmd"
                  type="text"
                  placeholder="node dist/main.js"
                  spellCheck={false}
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                />
              </div>
            </div>

            {/* Параметры */}
            <fieldset className="field">
              <legend className="field-label">Параметры</legend>

              <div className="check-list">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={multiStage}
                    onChange={handleCheckboxChange(setMultiStage)}
                  />
                  <span>Multi-stage сборка</span>
                </label>

                <label className="check">
                  <input
                    type="checkbox"
                    checked={nonRoot}
                    onChange={handleCheckboxChange(setNonRoot)}
                  />
                  <span>Запуск не от root</span>
                </label>

                <label className="check">
                  <input
                    type="checkbox"
                    checked={healthcheck}
                    onChange={handleCheckboxChange(setHealthcheck)}
                  />
                  <span>HEALTHCHECK</span>
                </label>

                <label className="check">
                  <input
                    type="checkbox"
                    checked={dockerignore}
                    onChange={handleCheckboxChange(setDockerignore)}
                  />
                  <span>Создать .dockerignore</span>
                </label>
              </div>
            </fieldset>

            <div className="actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={sendData}
                disabled={loading}
              >
                {loading ? 'Генерация...' : 'Сгенерировать Dockerfile'}
              </button>
            </div>
          </section>

          {/* Сообщения */}
          {error && (
            <section className="card">
              <p role="status">{error}</p>
            </section>
          )}

          {/* Результат */}
          {generatedTemplate && (
            <section className="card result">
              <div className="result-head">
                <span className="result-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
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
  );
}