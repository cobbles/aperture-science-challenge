
import React, { useEffect, useState } from 'react';
import { NextPage, NextPageContext  } from 'next'
import { useCookies } from "react-cookie"
import styles from '../styles/App.module.css'
import axios from 'axios';
import { parseCookies, resolveApiHost } from "../helpers/"
import { useRouter } from 'next/router'
import Layout from "../components/layout"

interface Subject {
  id?: number,
  name: string,
  test_chamber?: number,
  date_of_birth?: string,
  score?: number,
  alive?: boolean,
  created_at?: string,
  updated_at?: string
}

const emptySubject: Subject = {
  id: undefined,
  name: "",
  test_chamber: undefined,
  date_of_birth: "",
  score: undefined,
  alive: false,
  created_at: undefined,
  updated_at: undefined,
};

Subjects.getInitialProps = ({ req, res }: NextPageContext) => {
  const cookies = parseCookies(req);
  const { protocol, hostname } = resolveApiHost(req);
  return { XSRF_TOKEN: cookies["XSRF-TOKEN"], hostname, protocol };
}

export default function Subjects(props: NextPage & {XSRF_TOKEN: string, hostname: string, protocol:string}) {
  const router = useRouter();
  const [ authenticated, setAuth ] = useState<Boolean>(!!props.XSRF_TOKEN);
  const [ message, setErrorMessage ] = useState<string>('');
  const [cookie, setCookie, removeCookie] = useCookies(["XSRF-TOKEN"])
  const api = `${props.protocol}//${props.hostname}`;

  // Table State
  const [ subjects, setSubjects ] = useState<Array<Subject>>();
  const [ currentPage, setCurrentPage ] = useState<number>(1);
  const [ lastPage, setLastPage ] = useState<number>(1);

  // Form State
  const [showForm, setShowForm] = useState<boolean>(false);
  const [id, setId] = useState<number | undefined>();
  const [name, setName] = useState<string>("");
  const [testChamber, setTestChamber] = useState<number | undefined>();
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>();
  const [alive, setAlive] = useState<boolean | undefined>();
  const [score, setScore] = useState<number | undefined>();

  // Handlers
  const handleToggleForm = (subject: Subject) => {
    const dob = subject.date_of_birth ? formatISODate(subject.date_of_birth) : "";
    setId(subject.id);
    setName(subject.name);
    setTestChamber(subject.test_chamber);
    setDateOfBirth(dob);
    setScore(subject.score);
    setAlive(subject.alive);
    setShowForm(!showForm)
  }

  const logout = async () => {
    try {
      await axios({
        method: "post",
        url: `${api}/logout`,
        withCredentials: true
      }).then((response) => {
        removeCookie("XSRF-TOKEN");
        setAuth(!(response.status === 204))
        return router.push('/');
      })
    } catch (e) {
      console.log(e);
    }
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) {
      return '???'
    }
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }

  const formatISODate = (dateStr: string) => {
    return new Date(dateStr).toISOString().substring(0,10);
  }

  useEffect(() => {
    if (authenticated) {
      fetchSubjects();
    } else {
      router.push('/');
      return;
    }
  }, [authenticated, currentPage]);

  const fetchSubjects = () => {
    const query = `
      query {
        subjects(page: ${currentPage}) {
          data {id name test_chamber date_of_birth score alive created_at}
          paginatorInfo {currentPage lastPage}
        }
      }
    `;

    axios
      .post(`${api}/graphql`, { query }, { withCredentials: true })
      .then((response) => {
        const subjects = response.data?.data?.subjects.data;
        const paginatorInfo = response.data?.data?.subjects.paginatorInfo;
        if (subjects && subjects.length > 0) {
          setSubjects(subjects as Subject[]);
        }
        if (paginatorInfo) {
          setCurrentPage(paginatorInfo.currentPage as number);
          setLastPage(paginatorInfo.lastPage as number);
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.data?.message) {
          if (e.response?.data?.message === "CSRF token mismatch.") {
            return setErrorMessage(
              "Your session has expired, please log in again."
            );
          } else {
            return setErrorMessage(e.response?.data?.message);
          }
        } else {
          return setErrorMessage("An error occurred, please try again later.");
        }
      });
  };

  const saveSubject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Inject a id param if we are update a subject
    const idParam = id ? `id: ${id}` : ''
    const query = `
      mutation {
        upsertSubject(${idParam}, name: "${name}", date_of_birth: "${dateOfBirth}", test_chamber: ${testChamber}, score: ${score}, alive: ${alive}) {
          id
          name
          date_of_birth
          test_chamber
          score
          alive
          created_at
        }
      }
    `;

    axios
      .post(
        `${api}/graphql`,
        { query },
        { withCredentials: true }
      )
      .then((response) => {
        fetchSubjects();
        setShowForm(!showForm);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderForm = () => {
    return (
      <form data-testid="subject-form" onSubmit={saveSubject}>
        <h2>{id ? `EDIT SUBJECT: ${id}` : "CREATE SUBJECT"}</h2>
        <div className="inputGroup">
          <label>Name:</label>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className="inputGroup">
          <label>DOB:</label>
          <input
            type="date"
            required
            onChange={(e) => setDateOfBirth(formatISODate(e.target.value))}
            value={dateOfBirth}
          />
        </div>
        <div className="inputGroup">
          <label>Alive:</label>
          <input
            type="checkbox"
            onChange={(e) => setAlive(!alive)}
            checked={alive}
          />
        </div>
        <div className="inputGroup">
          <label>Score:</label>
          <input
            type="number"
            required
            pattern="\d*"
            onChange={(e) => setScore(Number(e.target.value))}
            value={score}
          />
        </div>
        <div className="inputGroup">
          <label>Test Chamber:</label>
          <input
            type="number"
            required
            pattern="\d*"
            onChange={(e) => setTestChamber(Number(e.target.value))}
            value={testChamber}
          />
        </div>
        <input data-testid="subject-form-submit-btn" type="submit" value="Submit" />
      </form>
    );
  };

  const renderTable = () => {
    const cols = ["ID", "Name", "DOB", "Alive", "Score", "Test Chamber", "Actions"];
    const placeholder = Array(10).fill(
      <tr>{Array(cols.length).fill(<td>&nbsp;</td>)}</tr>
    );
    const subjectRows = subjects?.map((subject) => (
      <tr key={subject.id}>
        <td>{subject.id}</td>
        <td>{subject.name}</td>
        <td>{formatDate(subject.date_of_birth)}</td>
        <td>{subject.alive ? "Y" : "N"}</td>
        <td>{subject.score}</td>
        <td>{subject.test_chamber}</td>
        <td>
          <button data-testid="subject-form-edit-btn" onClick={() => handleToggleForm(subject)}>
            edit
          </button>
        </td>
      </tr>
    ));
    return (
      <div className={styles.skeleton} data-testid="skeleton">
        <table data-testid="subjects-table">
          <thead>
            <tr>
              {cols.map((c) => (
                <td>{c}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {subjects && subjects.length > 0 ? subjectRows : placeholder}
          </tbody>
          <tfoot>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td rowSpan={cols.length}>
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>previous</button>
                <span>Page:{currentPage} / {lastPage}</span>
                <button onClick={() => setCurrentPage(Math.min(lastPage, currentPage + 1))}>next</button>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
        </tfoot>
        </table>
      </div>
    );
  };

  return (
    <Layout>
      <h1>Testing Subjects</h1>
      <section className={styles.content}>
        <button data-testid="subject-form-btn" onClick={() => handleToggleForm(emptySubject)}>
          {showForm ? "cancel" : "create"}
        </button>
        {(message && <p data-testid="error-msg">{message}</p>) ||
          (showForm ? renderForm() : renderTable())}
        {authenticated && <button onClick={logout}>Log out</button>}
      </section>
    </Layout>
  );
}
