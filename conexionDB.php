<?php
    header('Content-Type: text/xml');
    echo '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>';
    echo '<response>';

    //hontoy no mono koko he
    $mysqli = new mysqli("127.0.0.1:3306", "root", "", "hanzi_db");     // works en servidor local PC & mobile
    $mysqli->set_charset("utf8mb4");

    if($_GET['operacion'] == 'r'){
        $resultado = $mysqli->query("SELECT * FROM hanzi_list WHERE hanzi_glyph='".$_GET['glifo']."';");
        // echo $resultado -> num_rows;      // da 1  (a menos que haya multiples)
        
        $registro = mysqli_fetch_assoc($resultado);
        echo htmlspecialchars($registro['hanzi_mnemon']);   // htmlspecialchars permite echo tags <i>abc</i> as text
    }
    elseif($_GET['operacion'] == 'w'){
        // $resultado = $mysqli->query("INSERT INTO hanzi_list VALUES ('".$_GET['glifo']."','','".$_GET['cuento']."');");
        // $resultado = $mysqli->query("UPDATE hanzi_list SET hanzi_mnemon = '".$_GET['cuento']."' WHERE hanzi_glyph ='".$_GET['glifo']."';");
        if($_GET['hanziHK'] != ''){
            $resultado = $mysqli->query("
                INSERT INTO hanzi_list (hanzi_glyph, hanzi_traduc, hanzi_mnemon)
                VALUES ('".$_GET['hanziHK']."', '', '".$_GET['cuento']."')
                ON DUPLICATE KEY UPDATE hanzi_mnemon = VALUES(hanzi_mnemon);
            ");
        }
        if($_GET['kanjiJP'] != ''){
            $resultado = $mysqli->query("
                INSERT INTO hanzi_list (hanzi_glyph, hanzi_traduc, hanzi_mnemon)
                VALUES ('".$_GET['kanjiJP']."', '', '".$_GET['cuento']."')
                ON DUPLICATE KEY UPDATE hanzi_mnemon = VALUES(hanzi_mnemon);
            ");
        }
        if($_GET['hanziCN'] != ''){
            $resultado = $mysqli->query("
                INSERT INTO hanzi_list (hanzi_glyph, hanzi_traduc, hanzi_mnemon)
                VALUES ('".$_GET['hanziCN']."', '', '".$_GET['cuento']."')
                ON DUPLICATE KEY UPDATE hanzi_mnemon = VALUES(hanzi_mnemon);
            ");
        }
        
        $registro = mysqli_fetch_assoc($resultado);
        // echo $registro['hanzi_mnemon'];   // arbol
        // echo "ha sido escrito";
    }

    $mysqli->close();
    echo '</response>';
?>
