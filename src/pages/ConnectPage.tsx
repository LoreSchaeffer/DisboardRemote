import styles from './ConnectPage.module.css';
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Input from "../components/forms/Input";
import Button from "../components/misc/Button";
import {useSocket} from "../context/SocketContext.ts";
import Separator from "../components/misc/Separator.tsx";
import Row from "../components/layout/Row.tsx";
import Col from "../components/layout/Col.tsx";
import Spinner from "../components/misc/Spinner.tsx";

const ConnectPage: React.FC = () => {
    const {
        host,
        port,
        username,
        connected,
        isConnecting,
        error,
        setConnectionParams,
        setCredentials,
        connect
    } = useSocket();

    const navigate = useNavigate();

    const [localHost, setLocalHost] = useState<string>(host || "");
    const [localPort, setLocalPort] = useState<string>(port?.toString() || "4466");
    const [localUser, setLocalUser] = useState<string>(username || "");
    const [localPass, setLocalPass] = useState<string>("");

    useEffect(() => {
        if (connected) {
            navigate("/", {replace: true});
        }
    }, [connected, navigate]);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setConnectionParams(localHost, parseInt(localPort, 10));
        setCredentials(localUser, localPass);
        connect();
    };

    return (
        <div className={styles.connectionContainer}>
            <h1>Disboard Remote Connection</h1>
            <Separator/>

            <form className={styles.form} onSubmit={handleSubmit}>
                <Row className={styles.row}>
                    <Col size={3}>
                        <label htmlFor={'hostname'}>Hostname</label>
                    </Col>
                    <Col className={styles.col}>
                        <Input
                            id={'hostname'}
                            className={styles.input}
                            type="text"
                            placeholder="Hostname"
                            value={localHost}
                            onChange={(e) => setLocalHost(e.target.value)}
                            required
                            disabled={isConnecting}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col size={3}>
                        <label htmlFor={'port'}>Port</label>
                    </Col>
                    <Col className={styles.col}>
                        <Input
                            id={'port'}
                            className={styles.input}
                            type="number"
                            placeholder="Port"
                            value={localPort}
                            onChange={(e) => setLocalPort(e.target.value)}
                            required
                            disabled={isConnecting}
                        />
                    </Col>
                </Row>

                <Separator/>

                <Row className={styles.row}>
                    <Col size={3}>
                        <label htmlFor={'username'}>Username</label>
                    </Col>
                    <Col className={styles.col}>
                        <Input
                            id={'username'}
                            className={styles.input}
                            type="text"
                            placeholder="Username"
                            value={localUser}
                            onChange={(e) => setLocalUser(e.target.value)}
                            disabled={isConnecting}
                        />
                    </Col>
                </Row>

                <Row className={styles.row}>
                    <Col size={3}>
                        <label htmlFor={'password'}>Password</label>
                    </Col>
                    <Col className={styles.col}>
                        <Input
                            id={'password'}
                            className={styles.input}
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={localPass}
                            onChange={(e) => setLocalPass(e.target.value)}
                            disabled={isConnecting}
                        />
                    </Col>
                </Row>

                {error && (
                    <div className={styles.error} role={'alert'}>
                        <span className={styles.errorTitle}>Error: </span>
                        <span className={styles.errorMessage}>{error}</span>
                    </div>
                )}

                <Button
                    className={styles.submit}
                    type="submit"
                    disabled={isConnecting}
                >
                    {isConnecting && <Spinner size={"sm"} light/>}
                    {isConnecting ? 'Connecting...' : 'Connect'}
                </Button>
            </form>
        </div>
    );
};

export default ConnectPage;