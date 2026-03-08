import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center pixel-grid pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 border-4 border-strivo-red flex items-center justify-center"
        >
          <AlertTriangle className="w-12 h-12 text-strivo-red" />
        </motion.div>

        <h1 className="font-display text-6xl tracking-wider mb-2">
          <span className="text-strivo-red">4</span>0<span className="text-strivo-red">4</span>
        </h1>
        
        <p className="font-display text-xl tracking-widest mb-2">ERROR</p>
        
        <p className="text-muted-foreground mb-8 font-mono text-sm">
          &gt; ROUTE "{location.pathname}" NOT FOUND<br />
          &gt; SYSTEM CANNOT LOCATE REQUESTED PATH
        </p>

        <Link to="/" className="terminal-button inline-flex items-center gap-2">
          <Home className="w-4 h-4" />
          RETURN HOME
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
