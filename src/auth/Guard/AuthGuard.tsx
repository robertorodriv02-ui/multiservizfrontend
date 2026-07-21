import { useState, useEffect, type ReactNode } from "react";
import { isAuth } from "../services/authService";

interface Props {
  children: ReactNode;
  back?: ReactNode;
  load?: ReactNode;
}

function AuthGuard({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    isAuth().then((auth) => setIsAuthenticated(auth));
  }, []);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return <> {isAuthenticated ? children : null} </>;
};

export default AuthGuard

export function NoAuth({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    isAuth().then((auth) => setIsAuthenticated(auth));
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return <> {isAuthenticated ? null : children} </>;
};
