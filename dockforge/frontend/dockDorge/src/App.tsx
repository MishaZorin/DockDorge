
import './App.css';
import { useState } from 'react';

const API_URL = 'http://localhost:3000';

type GeneratorOptions = {
  multiStage: boolean;
  nonRoot: boolean;
  healthcheck: boolean;
  dockerignore: boolean;
};

export default function App() {
  // Backend
  const [imgBackValue, setImgBackValue] = useState('./backend');
  const [containerNameBack, setContainerNameBack] = useState('backend');
  const [externalPortBack, setExternalPortBack] = useState('8082');
  const [internalPortBack, setInternalPortBack] = useState('3000');

  // Frontend
  const [imgFrontValue, setImgFrontValue] = useState('./frontend/frontFiles');
  const [containerNameFront, setContainerNameFront] = useState('frontend');
  const [externalPortFront, setExternalPortFront] = useState('8083');
  const [internalPortFront, setInternalPortFront] = useState('80');

  // PostgreSQL
  const [dbName, setDbName] = useState('app_db');
  const [dbUser, setDbUser] = useState('app_user');
  const [dbPassword, setDbPassword] = useState('');

  // Dockerfile settings
  const [command, setCommand] = useState('node dist/main.js');

  const [options, setOptions] = useState<GeneratorOptions>({
    multiStage: true,
    nonRoot: true,
    healthcheck: false,
    dockerignore: true,
  });

  // .env
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');

  // Generated files
  const [generatedTemplate, setGeneratedTemplate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Send configuration to NestJS
  const sendData = async () => {
    setError('');

    if (!dbPassword.trim()) {
      setError('Укажи пароль PostgreSQL.');
      return;
    }

    const payload = {
      imgBackValue,
      imgFrontValue,

      containerNameBack,
      containerNameFront,

      externalPortBack,
      internalPortBack,
      externalPortFront,
      internalPortFront,

      dbName,
      dbUser,
      dbPassword,

      command,

      ...options,
    };

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/generator/compose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Ошибка сервера: HTTP ${response.status}`,
        );
      }

      setGeneratedTemplate(data.template);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось сгенерировать конфигурацию.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Create .env record
  const createEnv = async () => {
    setError('');

    try {
      const response = await fetch(`${API_URL}/envs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setInputValue('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось создать запись .env.',
      );
    }
  };

  // Get .env records
  const getDecryptedEnv = async () => {
    setError('');

    try {
      const response = await fetch(`${API_URL}/envs`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: { id: number; value: string }[] =
        await response.json();

      setOutput(data.map((item) => item.value).join('\n'));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось получить данные .env.',
      );
    }
  };

  // Update a single checkbox without overwriting other options
  const updateOption = (
    key: keyof GeneratorOptions,
    value: boolean,
  ) => {
    setOptions((previous) => ({
      ...previous,
      [key]: value,
    }));
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
          {/* .env generator */}
          <section className="card">
            <h1 className="card-title">Создание .env</h1>

            <p className="card-text">
              Впиши или вставь переменные окружения, по одной на
              строку в формате KEY=value.
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

          {/* .env output */}
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

          {/* Docker configuration */}
          <section className="card">
            <h2 className="card-title">Генератор Docker-конфигурации</h2>

            <p className="card-text">
              Настрой сервисы, PostgreSQL и параметры генерации.
            </p>

            {/* Backend and frontend */}
            <fieldset className="field">
              <legend className="field-label">Сервисы</legend>

              <div className="service-list">
                {/* Backend */}
                <div className="service">
                  <div className="service-head">
                    <span className="badge badge-backend">
                      Backend
                    </span>
                  </div>

                  <div className="field">
                    <label
                      className="field-label"
                      htmlFor="name-backend"
                    >
                      Имя контейнера
                    </label>

                    <input
                      className="input"
                      id="name-backend"
                      type="text"
                      value={containerNameBack}
                      onChange={(e) =>
                        setContainerNameBack(e.target.value)
                      }
                      placeholder="backend"
                      required
                    />
                  </div>

                  <div className="field">
                    <label
                      className="field-label"
                      htmlFor="img-backend"
                    >
                      Путь к сборке или образ
                    </label>

                    <input
                      className="input"
                      id="img-backend"
                      type="text"
                      value={imgBackValue}
                      onChange={(e) =>
                        setImgBackValue(e.target.value)
                      }
                      placeholder="./backend"
                      required
                    />
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label
                        className="field-label"
                        htmlFor="ext-backend"
                      >
                        Внешний порт
                      </label>

                      <input
                        className="input"
                        id="ext-backend"
                        type="number"
                        min={1}
                        max={65535}
                        value={externalPortBack}
                        onChange={(e) =>
                          setExternalPortBack(e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="field">
                      <label
                        className="field-label"
                        htmlFor="int-backend"
                      >
                        Внутренний порт
                      </label>

                      <input
                        className="input"
                        id="int-backend"
                        type="number"
                        min={1}
                        max={65535}
                        value={internalPortBack}
                        onChange={(e) =>
                          setInternalPortBack(e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Frontend */}
                <div className="service">
                  <div className="service-head">
                    <span className="badge badge-frontend">
                      Frontend
                    </span>
                  </div>

                  <div className="field">
                    <label
                      className="field-label"
                      htmlFor="name-frontend"
                    >
                      Имя контейнера
                    </label>

                    <input
                      className="input"
                      id="name-frontend"
                      type="text"
                      value={containerNameFront}
                      onChange={(e) =>
                        setContainerNameFront(e.target.value)
                      }
                      placeholder="frontend"
                      required
                    />
                  </div>

                  <div className="field">
                    <label
                      className="field-label"
                      htmlFor="img-frontend"
                    >
                      Путь к сборке или образ
                    </label>

                    <input
                      className="input"
                      id="img-frontend"
                      type="text"
                      value={imgFrontValue}
                      onChange={(e) =>
                        setImgFrontValue(e.target.value)
                      }
                      placeholder="./frontend/frontFiles"
                      required
                    />
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label
                        className="field-label"
                        htmlFor="ext-frontend"
                      >
                        Внешний порт
                      </label>

                      <input
                        className="input"
                        id="ext-frontend"
                        type="number"
                        min={1}
                        max={65535}
                        value={externalPortFront}
                        onChange={(e) =>
                          setExternalPortFront(e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="field">
                      <label
                        className="field-label"
                        htmlFor="int-frontend"
                      >
                        Внутренний порт
                      </label>

                      <input
                        className="input"
                        id="int-frontend"
                        type="number"
                        min={1}
                        max={65535}
                        value={internalPortFront}
                        onChange={(e) =>
                          setInternalPortFront(e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* PostgreSQL */}
            <fieldset className="field">
              <legend className="field-label">PostgreSQL</legend>

              <div className="field">
                <label className="field-label" htmlFor="db-name">
                  Название базы данных
                </label>

                <input
                  className="input"
                  id="db-name"
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="app_db"
                  required
                />
              </div>

              <div className="field">
                <label className="field-label" htmlFor="db-user">
                  Пользователь
                </label>

                <input
                  className="input"
                  id="db-user"
                  type="text"
                  value={dbUser}
                  onChange={(e) => setDbUser(e.target.value)}
                  placeholder="app_user"
                  required
                />
              </div>

              <div className="field">
                <label
                  className="field-label"
                  htmlFor="db-password"
                >
                  Пароль PostgreSQL
                </label>

                <input
                  className="input"
                  id="db-password"
                  type="password"
                  autoComplete="new-password"
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  placeholder="Введи пароль"
                  required
                />
              </div>
            </fieldset>

            {/* Dockerfile options */}
            <fieldset className="field">
              <legend className="field-label">
                Параметры генерации
              </legend>

              <div className="field">
                <label className="field-label" htmlFor="df-cmd">
                  Команда запуска
                </label>

                <input
                  className="input"
                  id="df-cmd"
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="node dist/main.js"
                />
              </div>

              <div className="check-list">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={options.multiStage}
                    onChange={(e) =>
                      updateOption('multiStage', e.target.checked)
                    }
                  />

                  <span>Multi-stage сборка</span>
                </label>

                <label className="check">
                  <input
                    type="checkbox"
                    checked={options.nonRoot}
                    onChange={(e) =>
                      updateOption('nonRoot', e.target.checked)
                    }
                  />

                  <span>Запуск не от root</span>
                </label>

                <label className="check">
                  <input
                    type="checkbox"
                    checked={options.healthcheck}
                    onChange={(e) =>
                      updateOption('healthcheck', e.target.checked)
                    }
                  />

                  <span>HEALTHCHECK</span>
                </label>

                <label className="check">
                  <input
                    type="checkbox"
                    checked={options.dockerignore}
                    onChange={(e) =>
                      updateOption('dockerignore', e.target.checked)
                    }
                  />

                  <span>Создать .dockerignore</span>
                </label>
              </div>
            </fieldset>

            {error && (
              <p role="alert" className="card-text">
                Ошибка: {error}
              </p>
            )}

            <div className="actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={sendData}
                disabled={loading}
              >
                {loading ? 'Генерация...' : 'Сгенерировать конфигурацию'}
              </button>
            </div>
          </section>

          {/* Generated Compose */}
          {generatedTemplate && (
            <section className="card result">
              <div className="result-head">
                <span className="result-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>

                <span className="file-name">
                  docker-compose.yml
                </span>
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
