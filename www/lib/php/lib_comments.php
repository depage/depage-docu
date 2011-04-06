<?php

class page_comments {
    /* {{{ url_regex */
    var $url_regex = "{
          \\b
          # Match the leading part (proto://hostname, or just hostname)
          (
            # http://, or https:// leading part
            (https?)://([-\\w]+(\\.\\w[-\\w]*)+)
          |
            # or, try to find a hostname with more specific sub-expression
            (?i: [a-z0-9] (?:[-a-z0-9]*[a-z0-9])? \\. )+ # sub domains
            # Now ending .com, etc. For these, require lowercase
            (?-i: com\\b
                | edu\\b
                | biz\\b
                | gov\\b
                | in(?:t|fo)\\b # .int or .info
                | mil\\b
                | net\\b
                | org\\b
                | [a-z][a-z]\\b # two-letter country code
                | [a-z][a-z]\\.[a-z][a-z]\\b # two two-letter country code
            )
          )

          # Allow an optional port number
          ( : \\d+ )?

          # The rest of the URL is optional, and begins with /
          (
            /
            # The rest are heuristics for what seems to work well
            [^.!,?\"\\'<>()\[\]\{\}\s\x7F-\\xFF]*
            (
              [.!,?]+ [^.!,?\"\\'<>()\\[\\]\{\\}\s\\x7F-\\xFF]+
            )*
          )?
        }ixD"; 
    /* }}} */

    /* {{{ get_comments() */
    function get_comments($page_id) {
        $comments = array();

        /*
        $comments[] = array(
            'date' => "11.11.2011",
            'important' => false,
            'name' => "Name",
            'email' => "jonas@depage.net",
            'link' => "http://www.depage.net",
            'subject' => "headline",
            'text' => "text\nzweite zeile\n\"www.gogol.com\"",
        );
         */

        return $comments;
    }
    /* }}} */
    /* {{{ add_comment() */
    function add_comment($page_id, $name, $email, $link, $subject, $text) {
    }
    /* }}} */
    /* {{{ handle_comments() */
    function handle_comments($page_id) {
        session_cache_expire(30);
        session_cache_limiter("private");
        session_name("depageCommentID");
        session_start();

        $this->fields = array(
            "subject",
            "text",
            "name",
            "email",
            "link",
        );

        // if new form data is submitted
        if ($_POST['commentsubmit'] == "true") {
            $errors = 0;
            foreach ($this->fields as $field) {
                $_SESSION['form_add_comment'][$page_id][$field] = $_POST[$field];

                $validdata = true;
                if ($field == "email" && !preg_match("/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i", $_POST[$field], $m)) {
                    $validdata = false;
                } elseif ($field == "link") {
                    // no action > not required
                } elseif (strlen(trim($_POST[$field])) < 2) {
                    $validdata = false;
                }

                if (!$validdata) {
                    $_SESSION['form_add_comment_errors'][$page_id][$field] = "error";
                    $errors++;
                } else {
                    $_SESSION['form_add_comment_errors'][$page_id][$field] = "";
                }
            }

            if ($errors == 0) {
                $this->add_comment($page_id, $_SESSION['form_add_comment_errors'][$page_id]['name'], $_SESSION['form_add_comment_errors'][$page_id]['email'], $_SESSION['form_add_comment_errors'][$page_id]['link'], $_SESSION['form_add_comment_errors'][$page_id]['subject'], $_SESSION['form_add_comment_errors'][$page_id]['text']);
                unset($_SESSION['form_add_comment'][$page_id]);
                unset($_SESSION['form_add_comment_errors'][$page_id]);
            }

            header("Location: " . $_SERVER["REQUEST_URI"] . "#form_add_comment");
            die();
        }
    }
    /* }}} */
    /* {{{ print_comments() */
    function print_comments($page_id) {
        $comments = $this->get_comments($page_id);

        echo("<div class=\"comments\">");
            if (count($comments) > 0) {
                echo("<h2>comments</h2>");
                foreach ($comments as $comment) {
                    $this->print_comment($comment);
                }
            }
            $this->print_comment_form($page_id);
        echo("</div>");
    }
    /* }}} */
    /* {{{ print_comment() */
    function print_comment($comment) {
        $class = "comment";

        if ($comment["important"]) {
            $class .= " important";
        }

        echo("<div class=\"$class\">");
            echo("<h3>" . htmlspecialchars($comment["subject"]) . "</h3>");
            echo("<p>" . $this->auto_link(htmlspecialchars($comment["text"])) . "</p>");
            echo("<p>" . htmlspecialchars($comment["name"]) . "</name>  &mdash; <date>" . htmlspecialchars($comment["date"]) . "</date>");
        echo("</div>");
    }
    /* }}} */
    /* {{{ print_comment_form() */
    function print_comment_form($page_id) {
        ?>
        <form method="POST" id="form_add_comment">
            <h3>add a comment</h3>
            <p class="<?php echo($_SESSION['form_add_comment_errors'][$page_id]['subject']); ?>">
                <label>subject*</label>
                <input type="text" name="subject" placeholder="subject" value="<?php echo(htmlentities($_SESSION['form_add_comment'][$page_id]['subject'])); ?>">
            </p>
            <p class="<?php echo($_SESSION['form_add_comment_errors'][$page_id]['text']); ?>">
                <label>message*</label>
                <textarea name="text" name="text" placeholder="comment"><?php echo(htmlentities($_SESSION['form_add_comment'][$page_id]['text'])); ?></textarea>
            </p>
            <p class="small <?php echo($_SESSION['form_add_comment_errors'][$page_id]['name']); ?>">
                <label>name*</label>
                <input type="text" name="name" placeholder="name or nickname" value="<?php echo(htmlentities($_SESSION['form_add_comment'][$page_id]['name'])); ?>">
            </p>
            <p class="small <?php echo($_SESSION['form_add_comment_errors'][$page_id]['email']); ?>">
                <label>email*</label>
                <input type="email" name="email" placeholder="not shown publicly" value="<?php echo(htmlentities($_SESSION['form_add_comment'][$page_id]['email'])); ?>">
            </p>
            <p class="small">
                <label>link</label>
                <input type="url" name="link" placeholder="optional" value="<?php echo(htmlentities($_SESSION['form_add_comment'][$page_id]['link'])); ?>">
            </p>
            <p class="small">
                <label>&nbsp;</label>
                <input type="hidden" name="commentsubmit" value="true" value="">
                <input type="submit" class="submit textbutton" value="submit" value="">
            </p>
        </form>
        <?php
    }
    /* }}} */
    /* {{{ auto_link() */
    function auto_link($text) {
        $linked = preg_replace_callback( $this->url_regex, create_function(
            '$m', '
                if ($m[2] == "http" || $m[2] == "https") {
                    return "<a href=\"$m[0]\" rel=\"nofollow\">$m[3]$m[5]$m[6]</a>";
                } else {
                    return "<a href=\"http://$m[1]\" rel=\"nofollow\">$m[1]</a>";
                }
            '), $text );

        return $linked;
    }
    /* }}} */
}

$c = new page_comments();
$c->handle_comments($page_id);

/* vim:set ft=php sw=4 sts=4 fdm=marker : */
