<?php
    header('Content-Type: text/xml');
    echo '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>';
    echo '<response>';
     //-----------------------DataBase------------------------
        $mysqli = new mysqli("127.0.0.1:3306", "root", "", "hanzi_db");
        mysqli_set_charset($mysqli, 'utf8');    //para chars en Japones

        if($_GET['operacion'] == 'r'){
            $resultado = $mysqli->query("SELECT * FROM hanzi_list WHERE hanzi_glyph='".$_GET['kanji']."';");
            // echo $resultado -> num_rows;      // da 1  (a menos que haya multiples)
           
            $registro = mysqli_fetch_assoc($resultado);
            echo $registro['hanzi_mnemon'];   // arbol
            // echo "ha sido LEIDO";
        }
        elseif($_GET['operacion'] == 'w'){
            $resultado = $mysqli->query("INSERT INTO hanzi_list VALUES ('".$_GET['kanji']."','ooliz','".$_GET['cuento']."');");
            $registro = mysqli_fetch_assoc($resultado);
            // echo $registro['hanzi_mnemon'];   // arbol
            echo "ha sido escrito";
        }
        elseif($_GET['operacion'] == 'o'){
            $resultado = $mysqli->query("UPDATE hanzi_list SET hanzi_mnemon = '".$_GET['cuento']."' WHERE hanzi_glyph ='".$_GET['kanji']."';");
            // update hanzi_list set hanzi_mnemon = 'china es lo mejor' where hanzi_glyph ='今';
            $registro = mysqli_fetch_assoc($resultado);
        }

        $mysqli->close();
    echo '</response>';
?>