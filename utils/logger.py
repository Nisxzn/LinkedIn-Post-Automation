import logging
import colorlog
import sys

def setup_logging():
    """Sets up a professional, colored logger for the application."""
    log_format = (
        "%(white)s%(asctime)s %(log_color)s%(levelname)-8s%(reset)s "
        "%(cyan)s%(name)s%(reset)s %(white)s—%(reset)s %(message)s"
    )

    colorlog.basicConfig(
        level=logging.INFO,
        format=log_format,
        datefmt="%Y-%m-%d %H:%M:%S",
        stream=sys.stdout,
        log_colors={
            'DEBUG':    'cyan',
            'INFO':     'green',
            'WARNING':  'yellow',
            'ERROR':    'red',
            'CRITICAL': 'red,bg_white',
        }
    )

    # Reduce noise from third-party libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)
    
    logger = logging.getLogger("app")
    logger.info("Professional logging system initialized.")
    return logger

logger = setup_logging()
