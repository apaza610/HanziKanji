<?php
    header('Content-Type: text/xml');
    echo '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>';
    echo '<response>';

    //hontoy no mono koko he
    $mysqli = new mysqli("127.0.0.1:3306", "root", "", "hanzi_db");     // works en servidor local PC & mobile
    $mysqli->set_charset("utf8mb4");

    if($_GET['operacion'] == 'r'){
        $resultado = $mysqli->query("SELECT * FROM hanzi_list WHERE hanzi_glyph='".$_GET['glifo']."';");
        $registro = mysqli_fetch_assoc($resultado);
        echo htmlspecialchars($registro['hanzi_traduc'] . '|');
        echo htmlspecialchars($registro['hanzi_radicals'] . '|');
        echo htmlspecialchars($registro['hanzi_mnemon'] . '|');   // htmlspecialchars permite echo tags <i>abc</i> as text
        // if($_GET['hanziHK'] == $_GET['glifo']){            }
        // echo $resultado -> num_rows;      // da 1  (a menos que haya multiples)
    }else{
        // $resultado = $mysqli->query("INSERT INTO hanzi_list VALUES ('".$_GET['glifo']."','','".$_GET['cuento']."');");
        // $resultado = $mysqli->query("UPDATE hanzi_list SET hanzi_mnemon = '".$_GET['cuento']."' WHERE hanzi_glyph ='".$_GET['hanziHK']."';");
        $cuento = $mysqli->real_escape_string($_GET['cuento']);
        $trad = $mysqli->real_escape_string($_GET['trad']);
        $radi = $mysqli->real_escape_string($_GET['radi']);
        $glifo = $mysqli->real_escape_string($_GET['glifo']);
        // $resultado = $mysqli->query("UPDATE hanzi_list 
        //                             SET hanzi_mnemon = '$cuento',
        //                                 hanzi_traduc = '$trad',
        //                                 hanzi_radicals = '$radi'
        //                             WHERE hanzi_glyph ='$glifo';
        //                             ");
        $query = "INSERT INTO hanzi_list (hanzi_glyph, hanzi_mnemon, hanzi_traduc, hanzi_radicals)
                VALUES ('$glifo', '$cuento', '$trad', '$radi')
                ON DUPLICATE KEY UPDATE
                hanzi_mnemon = VALUES(hanzi_mnemon),
                hanzi_traduc = VALUES(hanzi_traduc),
                hanzi_radicals = VALUES(hanzi_radicals)";

        $mysqli->query($query);
        // $registro = mysqli_fetch_assoc($resultado);
        // echo $registro['hanzi_mnemon'];   // arbol
    }
    $mysqli->close();
    echo '</response>';
?>
