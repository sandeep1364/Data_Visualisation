from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from app.config import Config
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_spark_session():
    """Create Spark session with Windows-specific configurations"""
    try:
        # Windows-specific Spark configurations
        spark_configs = {
            "spark.sql.adaptive.enabled": "true",
            "spark.sql.adaptive.coalescePartitions.enabled": "true",
            "spark.python.worker.reuse": "false",  # Important for Windows
            "spark.sql.execution.arrow.pyspark.enabled": "true",
            "spark.sql.execution.arrow.pyspark.fallback.enabled": "true"
        }
        
        builder = SparkSession.builder.appName("IntelliViewAnalysis")
        
        # Add configurations
        for key, value in spark_configs.items():
            builder = builder.config(key, value)
        
        # Create session
        spark = builder.getOrCreate()
        
        # Set log level to reduce noise
        spark.sparkContext.setLogLevel("WARN")
        
        logger.info("Spark session created successfully")
        return spark
        
    except Exception as e:
        logger.error(f"Failed to create Spark session: {str(e)}")
        raise

def analyze_hdfs_file(hdfs_path):
    """Analyze HDFS file using Spark"""
    spark = None
    try:
        logger.info(f"Starting analysis for HDFS path: {hdfs_path}")
        
        # Build the full HDFS URI
        if not hdfs_path.startswith('hdfs://'):
            full_hdfs_path = f"{Config.HDFS_URI_PREFIX}{hdfs_path}"
        else:
            full_hdfs_path = hdfs_path
            
        logger.info(f"Full HDFS URI: {full_hdfs_path}")
        
        # Create Spark session
        spark = create_spark_session()
        
        # Read the CSV file with more robust options
        logger.info(f"Reading CSV from: {full_hdfs_path}")
        df = spark.read.format("csv") \
            .option("header", "true") \
            .option("inferSchema", "true") \
            .option("mode", "PERMISSIVE") \
            .option("columnNameOfCorruptRecord", "_corrupt_record") \
            .load(full_hdfs_path)
        
        # Cache the DataFrame to avoid recomputation
        df.cache()
        
        logger.info(f"DataFrame loaded with {df.count()} rows and {len(df.columns)} columns")
        
        # Get schema
        schema = [(f.name, f.dataType.simpleString()) for f in df.schema.fields]
        logger.info(f"Schema: {schema}")
        
        # Get sample data (limit to avoid memory issues)
        sample = df.limit(5).toPandas().to_dict(orient='records')
        
        # Get row count
        row_count = df.count()
        logger.info(f"Total rows: {row_count}")
        
        # Analyze columns (simplified to avoid complex operations)
        col_stats = []
        summary_lines = []
        
        for field in df.schema.fields:
            name = field.name
            dtype = field.dataType.simpleString()
            logger.info(f"Analyzing column: {name} (type: {dtype})")
            
            try:
                col = df[name]
                missing = df.filter(col.isNull() | (col == '')).count()
                unique = df.select(name).distinct().count()
                
                stat = {
                    "name": name, 
                    "type": dtype, 
                    "missing": missing, 
                    "unique": unique
                }
                
                if dtype in ["int", "bigint", "double", "float", "decimal"]:
                    # Simplified numeric analysis
                    try:
                        desc = df.select(name).describe().toPandas().set_index('summary').to_dict()[name]
                        stat.update({
                            "mean": float(desc.get("mean", 0)) if desc.get("mean") != "null" else None,
                            "std": float(desc.get("stddev", 0)) if desc.get("stddev") != "null" else None,
                            "min": float(desc.get("min", 0)) if desc.get("min") != "null" else None,
                            "max": float(desc.get("max", 0)) if desc.get("max") != "null" else None,
                        })
                        
                        # Skip median and mode for now to avoid complex operations
                        stat["median"] = None
                        stat["mode"] = None
                        
                        summary_lines.append(f"Column '{name}' (numeric): min={stat['min']}, max={stat['max']}, mean={stat['mean']:.2f}, missing={missing}, unique={unique}.")
                    except Exception as e:
                        logger.warning(f"Could not analyze numeric column {name}: {e}")
                        stat.update({"mean": None, "std": None, "min": None, "max": None, "median": None, "mode": None})
                        summary_lines.append(f"Column '{name}' (numeric): analysis failed, missing={missing}, unique={unique}.")
                else:
                    # Non-numeric column analysis
                    stat["mode"] = None
                    summary_lines.append(f"Column '{name}' (type: {dtype}): missing={missing}, unique={unique}.")
                
                col_stats.append(stat)
                
            except Exception as e:
                logger.warning(f"Could not analyze column {name}: {e}")
                col_stats.append({
                    "name": name,
                    "type": dtype,
                    "missing": 0,
                    "unique": 0,
                    "error": str(e)
                })
        
        # Create summary paragraph
        summary_para = f"The dataset contains {row_count} rows and {len(df.columns)} columns. " + ' '.join(summary_lines)
        
        logger.info("Analysis completed successfully")
        
        return {
            "schema": schema,
            "sample": sample,
            "row_count": row_count,
            "columns": col_stats,
            "summary": summary_para
        }
        
    except Exception as e:
        logger.error(f"Error in analyze_hdfs_file: {str(e)}")
        raise Exception(f"Analysis failed: {str(e)}")
        
    finally:
        if spark:
            try:
                # Uncache and stop
                if 'df' in locals():
                    df.unpersist()
                spark.stop()
                logger.info("Spark session stopped")
            except Exception as e:
                logger.warning(f"Error stopping Spark session: {e}")
