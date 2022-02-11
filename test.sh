              KEYS=$(aws dynamodb scan --table-name BlogMetadata --region us-west-2 | jq -r .Items[].id.S)
              for remote_key in $KEYS
              do 
                delete=1
                for file in blogs/*/meta.json;
                  do
                    local_key=$(cat $file | jq -r .id.S)

                    if [ "$remote_key" == "$local_key" ]; then # If it is in the remote and local then dont delete
                      delete=0
                    fi

                  done

              if [ "$delete" -eq "1" ]; then
                echo "Deleting blog $remote_key from remote";
              fi

              done